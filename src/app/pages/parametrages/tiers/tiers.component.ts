import { Societe } from './../../../models/societe.model';
import { Component, OnInit ,ViewChild,TemplateRef} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Tiers } from 'src/app/models/tiers.model';
import { TiersService } from 'src/app/services/tiers/tiers.service';
import { Categorie } from 'src/app/models/categorie.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface TiersImportDTO {
  ligne: number;
  compte: string;
  intitule: string;
  erreur: string;
}

export interface ImportTiersResultDTO {
  success: boolean;
  message: string;
  lignesImportees: number;
  erreurs: TiersImportDTO[];
} 

@Component({
    selector: 'app-tiers',
    templateUrl: './tiers.component.html',
    styleUrls: ['./tiers.component.scss'],
    standalone: false
})
export class TiersComponent implements OnInit {

  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  //selected: boolean=false; 

  tiersList: Tiers[] = [];
  selected?: Tiers;

  // Utilisation de FormGroup[] avec typage clair
  tiers: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  categories: Categorie[] = [];

  selectedIndex: number | null = null;
  tiersForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  errorMessage: string | null = null;
  importResult: ImportTiersResultDTO | null = null;

  types=[{id:'CLIENT',libelle:'CLIENT'},{id:'FOURNISSEUR',libelle:'FOURNISSEUR'},{id:'SALARIE',libelle:'SALARIE'}];
  societes= [];

  constructor(
    private tiersService: TiersService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.tiersForm = this.fb.group({
      id: [],
      compte: ['', Validators.required],
      intitule: ['', Validators.required],
      compteCollectif: ['', Validators.required],
      interlocuteur: [''],
      telephoneInterlocuteur:[''],
      telephoneSociete:[''],
      type: ['', Validators.required],
      societeId: [1]
    });
    this.modelImportForm = this.fb.group({
      societeId: [1],
      fichierExcel: [null,Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'vos tiers', path: '/', active: true }];
    this.chargerTiers();
  }

  ajouter(): void {
    this.tiersForm.reset();
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
      const currentData = this.lignes[this.selectedIndex].value as Tiers;
      this.tiersForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteTiers(currentData);
    }
  }

  edit(nature: Tiers): void {
    this.selected = { ...nature };
    this.tiersForm.patchValue(this.selected);
    this.formVisible = true;
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.tiersForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as Tiers;
    this.tiersForm.setValue(currentData);
    this.selected = currentData;
  }

  enregistrer(): void {
    if (this.tiersForm.invalid) {
      this.showWarning('Formulaire invalide');
      return;
    }
    this.isLoading = true;
    const natureOperation = this.tiersForm.value as Tiers;
    natureOperation.societeId ;
    const action$ = this.selected?.id
      ? this.tiersService.update(this.selected.id, natureOperation)
      : this.tiersService.create(natureOperation);

    action$.subscribe({
      next: () => {
        const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
        this.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.tiersForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.isLoading = false;
        this.chargerTiers();
      },
      error: () => {
        this.isLoading = false;
        this.loading = false;
        this.showError("Une erreur est survenue lors de l'enregistrement du tiers!");
      }
    });
  }

  chargerTiers(): void {
    this.tiers = [];
    this.tiersService.getAll().subscribe({
      next: (data: Tiers[]) => {
        this.tiers = data.map(d =>
          this.fb.group({
            id: [d.id],
            compte: [d.compte],
            intitule: [d.intitule, Validators.required],
            compteCollectif: [d.compteCollectif, Validators.required],
            interlocuteur: [d.interlocuteur],
            telephoneInterlocuteur:[d.telephoneInterlocuteur],
            telephoneSociete:[d.telephoneSociete],
            type: [d.type, Validators.required],
            societeId: [d.societeId]
          })
        );
        this.lignes = this.tiers;
        this.result = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des natures opérations', error);
        this.result = true;
        this.showError('Erreur de chargement');
      }
    });
  }

  deleteTiers(tiers: Tiers): void {
    Swal.fire({
      title: 'Supprimer le tiers',
      html: `
        <p><strong>Tiers : </strong><span style="color: #009879; font-size: 1.2em;">${tiers.intitule}</span></p>
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
        this.tiersService.delete(tiers.id!).subscribe({
          next: () => {
            this.tiers = [];
            this.chargerTiers();
            Swal.fire('Succès', 'Tiers supprimé avec succès.', 'success');
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
  
    this.tiersService.importerTiers(formData).subscribe({
      next: (result) => {
        this.lignes=[];
        this.chargerTiers();
        this.importResult = result;
        this.isLoading = false;
  
        if (result.success) {
          this.showSuccess(`${result.message} (${result.lignesImportees} tiers importés)`);
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