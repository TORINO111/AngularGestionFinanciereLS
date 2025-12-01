import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'; // Assuming Swal is used for notifications
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service'; // Assuming this service exists
import { TypeJournalService } from 'src/app/services/type-journal';
import { TypeJournal } from 'src/app/models/type-journal.model';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-type-journal',
  standalone: false,
  templateUrl: './type-journal.component.html', // Updated template URL
  styleUrl: './type-journal.component.scss' // Updated style URL
})
export class TypeJournalComponent implements OnInit { // Renamed class

  @ViewChild('typeJournalModal', { static: true }) typeJournalModal!: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  pageTitle: BreadcrumbItem[] = [];
  typeJournals: TypeJournal[] = [];
  typeJournalForm!: UntypedFormGroup;

  totalElements: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  private search$ = new Subject<{ libelle: string }>();
  searchLibelle: string = '';

  isLoading: boolean = false;
  result: boolean = false;
  selectedIndex: number | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private notification: NotificationService,
    private typeJournalService: TypeJournalService // Injected the new service
  ) {
    this.typeJournalForm = this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      libelle: ['', [Validators.required, Validators.maxLength(100)]],
      // createdAt, updatedAt, createdBy, updatedBy will be set by backend or auth service
      createdBy: ['system'], // Placeholder
      updatedBy: ['system']  // Placeholder
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Types de Journal', path: '/', active: true }];
    this.chargerTypeJournals();
    this.initSearchListener();
  }

  chargerTypeJournals(page: number = 0): void {
    this.result = false;
    this.isLoading = true;
    this.currentPage = page;

    this.typeJournalService.getAllPageable(
      page,
      this.pageSize,
      this.searchLibelle ? this.searchLibelle : undefined
    ).subscribe({
      next: (data) => {
        this.typeJournals = data.content;
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.result = true;
        this.isLoading = false;
        this.notification.showError('Erreur lors du chargement des types de journal.');
        console.error("Erreur lors du chargement des types de journal:", error);
      }
    });
  }

  initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(({ libelle }) => {
          this.currentPage = 0;
          return this.typeJournalService.getAllPageable(
            0,
            this.pageSize,
            libelle || undefined
          );
        })
      )
      .subscribe({
        next: data => {
          this.typeJournals = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          console.error('Erreur lors de la recherche', err);
        }
      });
  }

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchLibelle });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number): void {
    this.chargerTypeJournals(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  openModal(): void {
    this.selectedIndex = null;
    this.typeJournalForm.reset();
    this.modalService.open(this.typeJournalModal, { size: 's', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
    this.typeJournalForm.reset();
  }

  editTypeJournal(index: number): void {
    this.selectedIndex = index;
    const typeJournal = this.typeJournals[index];
    this.typeJournalForm.patchValue(typeJournal); // Populate form with existing data

    this.modalService.open(this.typeJournalModal, { size: 'lg', centered: true });
  }

  deleteTypeJournal(id: number): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer ce type de journal ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeJournalService.delete(id).subscribe({
          next: () => {
            this.notification.showSuccess('Type de journal supprimé avec succès.');
            this.chargerTypeJournals(); // Reload list after deletion
          },
          error: (error) => {
            this.notification.showError('Erreur lors de la suppression du type de journal.');
            console.error("Erreur lors de la suppression:", error);
          }
        });
      }
    });
  }

  enregistrer(): void {
    if (this.typeJournalForm.invalid) {
      this.notification.showWarning('Formulaire invalide. Veuillez vérifier les champs.');
      return;
    }

    const typeJournalData: TypeJournal = this.typeJournalForm.value;

    const action = typeJournalData.id
      ? this.typeJournalService.update(typeJournalData.id, typeJournalData)
      : this.typeJournalService.create(typeJournalData);

    action.subscribe({
      next: () => {
        this.notification.showSuccess(`Type de journal ${typeJournalData.id ? 'mis à jour' : 'créé'} avec succès.`);
        this.closeModal();
        this.chargerTypeJournals(); // Reload list after save
      },
      error: (error) => {
        this.notification.showError(`Erreur lors de l'enregistrement du type de journal.`);
        console.error("Erreur lors de l'enregistrement:", error);
      }
    });
  }
}
