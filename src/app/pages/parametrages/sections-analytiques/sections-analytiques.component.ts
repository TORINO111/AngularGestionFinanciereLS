import { SectionAnalytiqueDTO } from 'src/app/models/section-analytique.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SectionAnalytiqueService } from 'src/app/services/section-analytique/section-analytique.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { PlansAnalytiquesService } from 'src/app/services/plans-analytiques/plans-analytiques.service';
import { PlanAnalytique } from 'src/app/models/plan-analytique.model';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-sections-analytiques.component',
  templateUrl: './sections-analytiques.component.html',
  styleUrl: './sections-analytiques.component.scss',
  standalone: false
})
export class SectionsAnalytiquesComponent implements OnInit {

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  @ViewChild('searchLibelleChamp', { static: true }) searchLibelleChamp!: ElementRef<HTMLInputElement>;

  sections: SectionAnalytiqueDTO[] = [];
  sectionForm!: UntypedFormGroup;

  plans: any[] = [];
  selectedIndex: number | null = null;
  formVisible = false;
  closeResult = '';
  pageTitle: BreadcrumbItem[] = [];

  totalElements: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  private search$ = new Subject<{ libelle: string }>();
  searchLibelle: string = '';
  lignes: any[] = [];


  constructor(
    private fb: UntypedFormBuilder,
    private sectionService: SectionAnalytiqueService,
    private planAnalytiqueService: PlansAnalytiquesService,
    private notification: NotificationService,
    private modalService: NgbModal
  ) {
    this.sectionForm = this.fb.group({
      id: [null],
      planAnalytiqueId: [null, Validators.required],
      libelle: ['', [Validators.required, Validators.pattern(/^[\p{L}\p{M}\d\s\-']+$/u)]],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos sections analytiques', path: '/', active: true }];
    this.chargerSectionsAnalytiques();
    this.chargerPlansAnalytiques();
    this.initSearchListener()
  }

  chargerPlansAnalytiques() {
    this.planAnalytiqueService.getAllPlanAnalytique().subscribe(
      {
        next: (data: PlanAnalytique[]) => {
          this.plans = data.map(d => ({
            id: d.id,
            intitule: d.intitule,
          }));
        },
        error: (error: any) => {
          console.log('Erreur lors du chargement des plans analytiques', error);
          this.notification.showError("erreur lors du chargement des plans analytiques");
        }
      }
    );
  }

  loadSections(): void {
    this.sectionService.getAllSectionAnalytiques().subscribe({
      next: (data: SectionAnalytiqueDTO[]) => this.sections = data,
      error: (err) => this.notification.showError('Erreur lors du chargement des sections')
    });
  }

  openModal(): void {
    this.formVisible = true;
    this.sectionForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { centered: true });
  }

  editSection(index: number): void {
    this.selectedIndex = index;
    const section = this.sections[index];
    this.sectionForm.patchValue(section);
    this.formVisible = true;
    this.modalService.open(this.modalContent, { centered: true });
  }

  deleteSection(index: number): void {
    const section = this.sections[index];
    Swal.fire({
      title: 'Supprimer la section',
      text: `Voulez-vous vraiment supprimer ${section.libelle} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(result => {
      if (result.isConfirmed) {
        this.sectionService.supprimerSectionAnalytique(section.id!).subscribe({
          next: () => {
            this.sections.splice(index, 1);
            this.notification.showSuccess('Section supprimée avec succès');
          },
          error: (error) => this.notification.showError(error)
        });
      }
    });
  }

  saveSection(): void {
    if (this.sectionForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const payload = this.sectionForm.value;

    if (this.selectedIndex !== null) {
      // Update
      const sectionId = this.sections[this.selectedIndex].id!;
      this.sectionService.modifierSectionAnalytique(sectionId, payload).subscribe({
        next: (updated) => {
          this.sections[this.selectedIndex!] = updated;
          this.notification.showSuccess('Section modifiée avec succès');
          this.modalService.dismissAll();
        },
        error: (err) => this.notification.showError(err)
      });
    } else {
      // Create
      this.sectionService.creerSectionAnalytique(payload).subscribe({
        next: (created) => {
          this.sections.push(created);
          this.notification.showSuccess('Section créée avec succès');
          this.modalService.dismissAll();
        },
        error: (err) => this.notification.showError(err)
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.sectionForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }

  /**
    * Charge la liste des sections analytiques avec pagination et filtres.
    * @param page numéro de la page (optionnel)
    */
  chargerSectionsAnalytiques(page: number = 0): void {
    this.currentPage = page;

    this.sectionService.getAllPageable(
      page,
      this.pageSize,
      this.searchLibelle || undefined,
    ).subscribe({
      next: (data: any) => {
        this.sections = data.content;
        this.lignes = [...this.sections];
        this.totalElements = data.totalElements;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sections analytiques', error);
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  /**
   * Retourne un tableau de pages pour la pagination.
   * @returns tableau d’index de pages
   */
  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  /**
   * Navigue vers une page spécifique.
   * @param page numéro de la page
   */
  goToPage(page: number = 0) {
    this.chargerSectionsAnalytiques(page);
  }

  /**
   * Calcule le nombre total de pages pour la pagination.
   * @returns nombre total de pages
   */
  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  /**
   * Déclenche la recherche dès que les filtres changent.
   */
  onFilterChange(): void {
    this.search$.next({ libelle: this.searchLibelle });
  }

  /**
   * Initialise l’écoute des changements sur les filtres avec debounce.
   */
  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ libelle }) => {
          this.currentPage = 0;
          return this.sectionService.getAllPageable(
            0,
            this.pageSize,
            libelle || undefined,
          );
        })
      )
      .subscribe({
        next: data => {
          this.lignes = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
        },
        error: err => console.error('Erreur lors de la recherche', err)
      });
  }

}
