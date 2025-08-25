import { Component, OnInit ,ViewChild,TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { PlanAnalytique } from '../../../models/plan-analytique.model';


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
  closeResult:string='';
  plansAnalytiquesList: PlanAnalytique[] = [];
  selected?: boolean=false;

  // Utilisation de FormGroup[] avec typage clair
  plansAnalytiques: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

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
    private toastr: ToastrService
  ) {
    this.planAnalytiqueForm = this.fb.group({
      sectionAnalytique: ['', Validators.required],
      intitule: ['', Validators.required],
      societeId: [1]
    });
    this.modelImportForm = this.fb.group({
      societeId: [1],
      fichierExcel: [null,Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'vos plans comptables', path: '/', active: true }];
    this.chargerPlanAnalytiques();
  }

  ajouter(): void {
    this.planAnalytiqueForm.reset();
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      this.formVisible = true;
    }
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as PlanAnalytique;
      this.planAnalytiqueForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deletePlanAnalytique(currentData);
    }
  }


  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.planAnalytiqueForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as PlanAnalytique;
    this.planAnalytiqueForm.setValue(currentData);
    this.selected = true;
  }

  enregistrer(): void {
    if (this.planAnalytiqueForm.invalid) {
      this.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const planAnalytique = this.planAnalytiqueForm.value as PlanAnalytique;

    const action$ = this.selected
      ? this.planComptableService.updatePlanAnalytique(planAnalytique.sectionAnalytique, planAnalytique)
      : this.planComptableService.createPlanAnalytique(planAnalytique);

    action$.subscribe({
      next: () => {
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.planAnalytiqueForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerPlanAnalytiques();
      },
      error: () => {
        this.loading = false;
        this.showError('Erreur serveur !!!');
      }
    });
  }

  chargerPlanAnalytiques(): void {
    this.plansAnalytiques = [];
    this.planComptableService.getAllPlanAnalytique().subscribe({
      next: (data: PlanAnalytique[]) => {
        //console.log(data)
        this.plansAnalytiques = data.map(d =>
          this.fb.group({
            sectionAnalytique: [d.sectionAnalytique],
            intitule: [d.intitule, Validators.required],
            societeId: [d.societeId]
          })
        );
        this.lignes = this.plansAnalytiques;
        this.selected = false;
        this.result = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plans comptables', error);
        this.result = true;
        this.showError('Erreur de chargement');
      }
    });
  }

  deletePlanAnalytique(planComptable: PlanAnalytique): void {
    Swal.fire({
      title: 'Supprimer le compte',
      html: `
        <p><strong>Compte : </strong><span style="color: #009879; font-size: 1.2em;">${planComptable.intitule}</span></p>
      `,
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
      if (result.value) {
        this.planComptableService.delete(planComptable.sectionAnalytique!).subscribe({
          next: () => {
            this.plansAnalytiques = [];
            this.chargerPlanAnalytiques();
            Swal.fire('Succès', 'PlanAnalytique supprimé avec succès.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
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
      this.showError(this.fileError);
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
      this.showWarning('Formulaire invalide');
      return;
    }
  
    const file = this.modelImportForm.value.fichierExcel;
    if (!file) {
      this.showWarning('Veuillez sélectionner un fichier Excel.');
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
        this.lignes=[];
        this.chargerPlanAnalytiques();
        this.importResult = result;
        this.isLoading = false;
  
        if (result.success) {
          this.showSuccess(`${result.message} (${result.lignesImportees} comptes importés)`);
        } else {
          this.showError(`${result.message} (${result.erreurs.length} erreurs détectées)`);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur lors de l’import.';
        console.error(errorMsg);
        this.showError(errorMsg);
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
       {size: 'lg', // set modal size
        centered: true ,scrollable: true ,
        backdrop: 'static', // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
           this.closeResult = `Closed with: ${result}`; 
         }, (reason) => { 
           this.closeResult =  
              `Dismissed ${this.getDismissReason(reason)}`; 
         });
    }

    openEditModal(editcontent: TemplateRef<NgbModal>): void {
      this.modalService.open(editcontent,
         {size: 'lg', // set modal size
          centered: true ,scrollable: true ,
          backdrop: 'static', // disable modal from closing on click outside
          keyboard: false,
          ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
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

  showSuccess(message: string): void {
    this.toastr.success(message, 'Succès', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showError(message: string): void {
    this.toastr.error(message, 'Erreur', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showWarning(message: string): void {
    this.toastr.warning(message, 'Attention', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }
}

