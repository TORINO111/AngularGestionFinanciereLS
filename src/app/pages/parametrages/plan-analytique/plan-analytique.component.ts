import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { PlanAnalytique, PlanAnalytiqueDTO } from '../../../models/plan-analytique.model';
import { SectionAnalytique } from 'src/app/models/section-analytique';
import { SectionAnalytiqueService } from 'src/app/services/section-analytique/section-analytique.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { PlansAnalytiquesService } from 'src/app/services/plans-analytiques/plans-analytiques.service';
import { debounceTime, Subject, switchMap } from 'rxjs';


export interface PlanComptableImportDTO {
  ligne: number;
  compte: string;
  intitule: string;
  erreur: string;
}

export interface ImportPlanComptableResultDTO {
  success: boolean;
  message: string;
  lignesImportees: number;
  erreurs: PlanComptableImportDTO[];
}
@Component({
  selector: 'app-plan-analytique',
  templateUrl: './plan-analytique.component.html',
  styleUrls: ['./plan-analytique.component.scss'],
  standalone: false
})
export class PlanAnalytiqueComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  @ViewChild('searchInputLibelle', { static: true }) searchInputLibelle!: ElementRef<HTMLInputElement>;

  closeResult: string = '';
  plansAnalytiquesList: PlanAnalytique[] = [];
  selected?: boolean = false;

  // Utilisation de FormGroup[] avec typage clair
  plansAnalytiques: UntypedFormGroup[] = [];
  lignes: any[] = [];

  searchLibelle: string = '';
  totalElements: number = 0;
  pageSize: number = 1;
  currentPage: number = 0;
  private search$ = new Subject<{ libelle: string }>();

  sectionsAnalytiques: SectionAnalytique[] = [];
  societes: any[] = []

  selectedIndex: number | null = null;
  planAnalytiqueForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  errorMessage: string | null = null;
  importResult: ImportPlanComptableResultDTO | null = null;
  societeBi: any;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private plansAnalytiquesService: PlansAnalytiquesService,
    private notification: NotificationService,
    private sectionAnalytiqueService: SectionAnalytiqueService,
    private societeService: SocieteService,
  ) {
    this.planAnalytiqueForm = this.fb.group({
      id: [null],
      intitule: ['', Validators.required],
    });
    this.modelImportForm = this.fb.group({
      societeId: [1],
      fichierExcel: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos plans analytiques', path: '/', active: true }];
    this.chargerPlanAnalytiques();
    // this.chargerSectionsAnalytiques();
    this.chargerSocietes();
    this.initSearchListener();

    const societeActiveStr = localStorage.getItem("societeActive");
    if (societeActiveStr) {
      this.societeBi = JSON.parse(societeActiveStr);
      console.log(this.societeBi);
      this.planAnalytiqueForm.patchValue({ societeId: this.societeBi.id });
      this.modelImportForm.patchValue({ societeId: this.societeBi.id });
    };
  }

  allowAlphaNumeric(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9-\s]*$/;
    const inputChar = event.key;
    if (!regex.test(inputChar)) {
      event.preventDefault(); // bloque le caractère
    }
  }

  chargerSectionsAnalytiques() {
    this.sectionAnalytiqueService.getAllSectionAnalytiques().subscribe(
      {
        next: (data: SectionAnalytique[]) => {
          this.sectionsAnalytiques = data.map(d => ({
            id: d.id,
            code: d.code,
            libelle: d.libelle,
          }));
          this.result = true;
        },
        error: (error: any) => {
          this.result = true;
          console.log('Erreur lors du chargement des sections analytiques', error);
          this.notification.showError("erreur lors du chargement des sections analytiques");
        }
      }
    );
  }

  chargerSocietes() {
    this.societeService.getAllSociete().subscribe(
      {
        next: (data: any[]) => {
          this.societes = data.map(d => ({
            id: d.id,
            nom: d.nom,
          }));
          this.result = true;
        },
        error: (error: any) => {
          this.result = true;
          console.log('Erreur lors du chargement des sociétés', error);
          this.notification.showError("erreur lors du chargement des sociétés");
        }
      }
    );
  }

  ajouter(): void {
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as PlanAnalytiqueDTO;
      this.planAnalytiqueForm.patchValue({
        id: currentData.id,
        intitule: currentData.intitule
      });
      this.formVisible = true;
    }
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentGroup = this.lignes[this.selectedIndex];
      const currentData = currentGroup.value as {
        planId: number,
        sectionId: number,
        sectionAnalytique: string,
        societe: string
      };

      console.log(currentData);

      Swal.fire({
        title: 'Supprimer la section',
        text: `Voulez-vous vraiment supprimer la section "${currentData.sectionAnalytique}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.plansAnalytiquesService.deleteSection(currentData.planId, currentData.sectionId)
            .subscribe({
              next: () => {
                this.lignes.splice(this.selectedIndex!, 1);
                this.selectedIndex = null;
                Swal.fire('Succès', `Section supprimée du plan avec succès`, 'success');
              },
              error: () => {
                Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
              }
            });
        }
      });
    }
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value;
    console.log(currentData);
    this.planAnalytiqueForm.patchValue({
      sectionsAnalytiques: [currentData.sectionAnalytique],
      societe: currentData.societe
    });

    this.selected = true;
  }

  enregistrer(): void {
    this.closeModal();
    this.isLoading = true;
    this.result = false;

    if (this.planAnalytiqueForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const planAnalytique = this.planAnalytiqueForm.value as PlanAnalytique;

    const action$ = planAnalytique.id!
      ? this.plansAnalytiquesService.updatePlanAnalytique(planAnalytique.id, planAnalytique)
      : this.plansAnalytiquesService.createPlanAnalytique(planAnalytique);

    action$.subscribe({
      next: () => {
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.chargerPlanAnalytiques();
        this.isLoading = false;
        this.result = true;
      },
      error: (error: any) => {
        this.notification.showError(error);
        this.isLoading = false;
        this.result = true;
      }
    });
  }

  chargerPlanAnalytiques(page: number = 0) {
    this.result = false;
    this.isLoading = true;

    this.currentPage = page;

    this.plansAnalytiquesService.getAllPlanAnalytiquePageable(
      page,
      this.pageSize,
      this.searchLibelle ? this.searchLibelle : undefined,
    ).subscribe({
      next: (data: any) => {
        this.plansAnalytiques = data.content;
        this.lignes = [...this.plansAnalytiques];
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;

      },
      error: (error: any) => {
        this.result = true;
        this.isLoading = false;

        console.error("Erreur lors du chargement des plans analytiques:", error);
        this.notification.showError('Erreur lors du chargement des plans analytiques!');
      }
    });
  }

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchLibelle });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ libelle }) => {
          this.currentPage = 0;
          return this.plansAnalytiquesService.getAllPlanAnalytiquePageable(
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

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    this.chargerPlanAnalytiques(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  deleteSectionDuPlan(planId: number, sectionId: number): void {
    Swal.fire({
      title: 'Supprimer la section',
      text: `Voulez-vous vraiment supprimer cette section ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-trash-alt"></i> Supprimer',
      cancelButtonText: '<i class="fa fa-ban"></i> Annuler',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.plansAnalytiquesService.delete(planId).subscribe({
          next: () => {
            // Mettre à jour le tableau frontend : retirer la section supprimée
            this.lignes.forEach(l => {
              if (l.value.id === planId) {
                l.value.sectionsAnalytiques = l.value.sectionsAnalytiques.filter((sid: number) => sid !== sectionId);
              }
            });
            Swal.fire('Succès', 'Section supprimée avec succès.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Abandonné', 'Suppression annulée', 'info');
      }
    });
  }


  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
  }

  openModal(): void {
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { centered: true });
  }

  editPlan(index: number): void {
    this.selectedIndex = index;
    const plan = this.lignes[index];
    // this.planAnalytiqueForm.patchValue(plan);
    this.planAnalytiqueForm.patchValue(plan);
    console.log(this.planAnalytiqueForm);

    this.modalService.open(this.modalContent, { centered: true });
  }

  deletePlan(index: number): void {
    const plan = this.lignes[index];
    console.log(plan);  
    if (!plan?.id || !plan?.intitule) return;

    Swal.fire({
      title: 'Supprimer le plan analytique',
      text: `Voulez-vous vraiment supprimer le plan : "${plan.intitule}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.plansAnalytiquesService.delete(plan.id)
          .subscribe({
            next: () => {
              this.lignes.splice(index, 1);
              this.selectedIndex = null;
              this.notification.showSuccess('Section supprimée avec succès !');
            },
            error: () => this.notification.showError('Erreur lors de la suppression')
          });
      }
    });
  }

}

