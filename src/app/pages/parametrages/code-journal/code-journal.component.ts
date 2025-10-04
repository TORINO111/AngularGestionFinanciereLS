import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { CodeJournalService } from 'src/app/services/code-journal/code-journal.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, switchMap, Subject } from 'rxjs';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';

@Component({
  selector: 'app-code-journal',
  templateUrl: './code-journal.component.html',
  standalone: false,
  styleUrls: ['./code-journal.component.scss']
})
export class CodeJournalComponent implements OnInit {
  @ViewChild('journalModal', { static: true }) journalModal!: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  codeJournaux: any[] = [];
  typesJournaux: any[] = [];
  journalForm: UntypedFormGroup;
  lignes: any[] = [];

  searchTerm: string = '';
  selectedTypeJournalId?: number;

  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  isLoading = false;
  result = false;

  private search$ = new Subject<{ libelle: string; typeJournalId?: number }>();
  selectedIndex: number | null = null;
  types: { id: any; libelle: any; }[];

  constructor(
    private codeJournalService: CodeJournalService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private notification: NotificationService,
    private typeCategorieService: TypeCategorieService
  ) {
    this.journalForm = this.fb.group({
      id: [null],
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      typeJournalId: [null, Validators.required],
      allowedCategoryTypes: [[]]
    });
  }

  ngOnInit(): void {
    this.loadTypesJournaux();
    this.loadCodeJournaux();
    this.initSearchListener();
    this.chargerTypesCategorie()
  }

  chargerTypesCategorie() {
    this.typeCategorieService.getAll().subscribe({
      next: (data: any[]) => {
        this.types = data.map(t => ({ id: t, libelle: t }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types', err);
        this.notification.showError("Erreur lors du chargement des types");
      }
    });
  }

  loadTypesJournaux(): void {
    this.codeJournalService.getTypes().subscribe({
      next: data => this.typesJournaux = data,
      error: err => this.notification.showError('Erreur lors du chargement des types')
    });
  }

  loadCodeJournaux(page: number = 0): void {
    this.isLoading = true;
    this.currentPage = page;
    this.codeJournalService.getAll(page, this.pageSize, this.searchTerm, this.selectedTypeJournalId)
      .subscribe({
        next: data => {
          this.codeJournaux = data.content;
          this.lignes = [...this.codeJournaux];
          this.totalElements = data.totalElements;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.notification.showError('Erreur lors du chargement des codes journaux');
        }
      });
  }

  initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ libelle, typeJournalId }) => {
          this.currentPage = 0;
          return this.codeJournalService.getAll(0, this.pageSize, libelle, typeJournalId);
        })
      )
      .subscribe({
        next: data => {
          this.codeJournaux = data.content;
          this.lignes = [...this.codeJournaux];
          this.totalElements = data.totalElements;
        },
        error: err => console.error('Erreur recherche', err)
      });
  }

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchTerm, typeJournalId: this.selectedTypeJournalId });
  }

  pages(): number[] {
    return Array(Math.ceil(this.totalElements / this.pageSize)).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadCodeJournaux(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  openModal(): void {
    this.modalService.open(this.journalModal, { size: 'lg', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
  }

  editJournal(index: number): void {
    this.selectedIndex = index;
    const j = this.codeJournaux[index];
    console.log(j);
    this.journalForm.patchValue({
      id: j.id,
      libelle: j.libelle,
      typeJournalId: j.typeJournal?.id,
      allowedCategoryTypes: j.allowedCategoryTypes
    });
    this.modalService.open(this.journalModal, { size: 'lg', centered: true });
  }

  deleteJournal(index: number): void {
    const j = this.codeJournaux[index];
    if (!confirm(`Supprimer le journal "${j.libelle}" ?`)) return;
    this.codeJournalService.delete(j.id).subscribe({
      next: () => this.notification.showSuccess('Journal supprimé'),
      error: () => this.notification.showError('Erreur suppression'),
      complete: () => this.loadCodeJournaux(this.currentPage)
    });
  }

  save(): void {
    this.closeModal();
    this.isLoading = true;
    this.result = false;

    if (this.journalForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      this.isLoading = false;
      this.result = true;
      return;
    }

    const action$ = this.journalForm.value.id
      ? this.codeJournalService.update(this.journalForm.value.id, this.journalForm.value)
      : this.codeJournalService.create(this.journalForm.value);

    action$.subscribe({
      next: () => {
        const msg = this.journalForm.value.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.selectedIndex = null;
        this.loadCodeJournaux(this.currentPage);
        this.isLoading = false;
        this.result = true;
        this.modalService.dismissAll();
      },
      error: err => {
        this.notification.showError(err);
        this.isLoading = false;
        this.result = true;
      }
    });
  }

}
