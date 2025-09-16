import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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

  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult: string = '';
  plansAnalytiquesList: PlanAnalytique[] = [];
  selected?: boolean = false;

  // Utilisation de FormGroup[] avec typage clair
  plansAnalytiques: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

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

  constructor(
    private planComptableService: PlanComptableService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private plansAnalytiquesService: PlansAnalytiquesService,
    private notification: NotificationService,
    private sectionAnalytiqueService: SectionAnalytiqueService,
    private societeService: SocieteService,
  ) {
    this.planAnalytiqueForm = this.fb.group({
      id: [null],
      sectionAnalytiques: [[], Validators.required],
      societe: [''],
    });
    this.modelImportForm = this.fb.group({
      societeId: [1],
      fichierExcel: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos sections analytiques', path: '/', active: true }];
    this.chargerPlanAnalytiques();
    this.chargerSectionsAnalytiques();
    this.chargerSocietes();
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
    this.planAnalytiqueForm.reset();
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as PlanAnalytiqueDTO;
      this.planAnalytiqueForm.patchValue({
        id: currentData.id,
        sectionsAnalytiques: currentData.sectionsAnalytiques,
        societe: currentData.societe
      });
      this.formVisible = true;
    }
  }

  // supprimer(): void {
  //   if (this.selectedIndex !== null) {
  //     const currentData = this.lignes[this.selectedIndex].value as PlanAnalytique;
  //     this.planAnalytiqueForm.setValue(currentData);
  //     this.lignes.splice(this.selectedIndex, 1);
  //     this.selectedIndex = null;
  //     this.deleteSectionDuPlan(currentData.id, currentData.);
  //   }
  // }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentGroup = this.lignes[this.selectedIndex]; // FormGroup
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
                this.planAnalytiqueForm.reset();
                Swal.fire('Succès', 'Section supprimée avec succès.', 'success');
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
    this.planAnalytiqueForm.reset();
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
    console.log(this.planAnalytiqueForm.value);
    if (this.planAnalytiqueForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const planAnalytique = this.planAnalytiqueForm.value as PlanAnalytique;

    const action$ = planAnalytique.id!
      ? this.plansAnalytiquesService.updatePlanAnalytique(planAnalytique.sectionsAnalytiques[0], planAnalytique)
      : this.plansAnalytiquesService.createPlanAnalytique(planAnalytique);

    action$.subscribe({
      next: () => {
        this.loading = false;
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.planAnalytiqueForm.reset();
        this.selectedIndex = null;
        this.selected = undefined;
        this.isLoading = false;
        this.chargerPlanAnalytiques();
      },
      error: (error: any) => {
        this.notification.showError(error);
        this.isLoading = false;
        this.planAnalytiqueForm.reset();
        this.selectedIndex = null;
        this.selected = false;
        this.chargerPlanAnalytiques();
      }
    });
  }

  // enregistrer(): void {
  //   if (this.planAnalytiqueForm.invalid) {
  //     this.notification.showWarning('Formulaire invalide');
  //     return;
  //   }

  //   this.isLoading = true;

  //   const planAnalytique = this.planAnalytiqueForm.value as PlanAnalytique;

  //   const action$ = this.selected
  //     ? this.plansAnalytiquesService.updatePlanAnalytique(planAnalytique.sectionAnalytique, planAnalytique)
  //     : this.plansAnalytiquesService.createPlanAnalytique(planAnalytique);

  //   action$.subscribe({
  //     next: () => {
  //       this.loading = false;
  //       const msg = this.selected ? 'Modifié' : 'Enregistré';
  //       this.notification.showSuccess(`${msg} avec succès`);
  //       this.formVisible = false;
  //       this.planAnalytiqueForm.reset();
  //       this.selectedIndex = null;
  //       this.selected = undefined;
  //       this.isLoading = false;
  //       this.chargerPlanAnalytiques();
  //     },
  //     error: (error: any) => {
  //       this.notification.showError(error);
  //       this.isLoading = false;
  //       this.planAnalytiqueForm.reset();
  //       this.selectedIndex = null;
  //       this.selected = false;
  //       this.chargerPlanAnalytiques();
  //     }
  //   });
  // }


  // chargerPlanAnalytiques(): void {
  //   this.planComptableService.getAllPlanAnalytique().subscribe({
  //     next: (data: PlanAnalytiqueDTO[]) => {
  //       //console.log(data)
  //       this.plansAnalytiques = data.map(d =>
  //         this.fb.group({
  //           id: [d.id],
  //           sectionAnalytique: [d.sectionAnalytique],
  //           societe: [d.societe]
  //         })
  //       );
  //       this.lignes = this.plansAnalytiques;
  //       console.log('lignes:', this.lignes);
  //       this.selected = false;
  //       this.result = true;
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors du chargement des plans analytiques', error);
  //       this.result = true;
  //       this.notification.showError('Erreur de chargement');
  //     }
  //   });
  // }

  chargerPlanAnalytiques(): void {
    this.planComptableService.getAllPlanAnalytique().subscribe({
      next: (data: PlanAnalytiqueDTO[]) => {
        this.plansAnalytiques = [];

        data.forEach(plan => {
          (plan.sectionsAnalytiques || []).forEach(section => {
            this.plansAnalytiques.push(
              this.fb.group({
                planId: [plan.id],
                sectionId: [section.id],
                sectionAnalytique: [section.libelle],
                societe: [plan.societe]
              })
            );
          });
        });

        this.lignes = this.plansAnalytiques;
        this.selected = false;
        this.result = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plans analytiques', error);
        this.result = true;
        this.notification.showError('Erreur de chargement');
      }
    });
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
        this.planComptableService.delete(planId, sectionId).subscribe({
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

  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validExtensions = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();

    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      this.fileError = 'Seuls les fichiers Excel (.xls, .xlsx) sont autorisés.';
      this.notification.showError(this.fileError);
      input.value = ''; // réinitialise le champ
      this.modelImportForm.patchValue({ fichierExcel: null });
      return;
    }

    this.fileError = null;
    this.modelImportForm.patchValue({ fichierExcel: file });
    this.modelImportForm.get('fichierExcel')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.modelImportForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const file = this.modelImportForm.value.fichierExcel;
    if (!file) {
      this.notification.showWarning('Veuillez sélectionner un fichier Excel.');
      return;
    }

    this.isLoading = true;
    this.importResult = null;

    const formData = new FormData();
    const societeId = this.modelImportForm.value.societeId;
    const otherData = { ...this.modelImportForm.value };
    delete otherData.fichierExcel;

    formData.append('societeId', societeId);
    //formData.append('modelImport', new Blob([JSON.stringify(otherData)], { type: 'application/json' }));
    formData.append('fichierExcel', file);

    this.planComptableService.importerPlanAnalytique(formData).subscribe({
      next: (result) => {
        this.lignes = [];
        this.chargerPlanAnalytiques();
        this.importResult = result;
        this.isLoading = false;

        if (result.success) {
          this.notification.showSuccess(`${result.message} (${result.lignesImportees} comptes importés)`);
        } else {
          this.notification.showError(`${result.message} (${result.erreurs.length} erreurs détectées)`);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur lors de l’import.';
        console.error(errorMsg);
        this.notification.showError(errorMsg);
        this.importResult = {
          success: false,
          message: errorMsg,
          lignesImportees: 0,
          erreurs: []
        };
        this.isLoading = false;
      }
    });
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    //this.codeBudgetaireForm.reset();
    this.modalService.open(content,
      {
        size: 'lg', // set modal size
        centered: true, scrollable: true,
        backdrop: 'static', // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  openEditModal(editcontent: TemplateRef<NgbModal>): void {
    this.modalService.open(editcontent,
      {
        size: 'lg', // set modal size
        centered: true, scrollable: true,
        backdrop: 'static', // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }
}

