import { Component, OnInit,ViewChild,TemplateRef  } from '@angular/core';
import {UntypedFormGroup,Validators,UntypedFormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OperationDto } from 'src/app/models/operation.model';
import { NatureOperationService } from 'src/app/services/operations/operations.service';
import { ImportOperationResultDTO, Operation } from 'src/app/models/operationRevoke.model';
import { OperationService } from 'src/app/services/operationsRevolu/operation.service';
import { Tiers } from 'src/app/models/tiers.model';
import { TiersService } from 'src/app/services/tiers/tiers.service';
import { Select2Data } from 'ng-select2-component';
import { forkJoin, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { Societe } from 'src/app/models/societe.model';
import { SocieteSelectionService } from 'src/app/services/societe-selection/societe-selection.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerciceComptableService } from 'src/app/services/exercices-comptables/exercice-comptable.service';
import { ExerciceComptable } from 'src/app/models/exercice-comptable.model';
import { filter, takeUntil } from 'rxjs/operators'; 

@Component({
    selector: 'app-recettes',
    templateUrl: './recettes.component.html',
    styleUrls: ['./recettes.component.scss'],
    standalone: false
})
export class RecettesComponent implements OnInit {
  private destroy$ = new Subject<void>();

  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  operationList: Operation[] = [];
  selected?: Operation;

  // Utilisation de FormGroup[] avec typage clair
  operations: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  natureOperations: { value: number, label: string }[] = [];
  tiers: { value: number, label: string }[] = [];

  selectedIndex: number | null = null;
  operationForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  isComptable=false;

  societeActive: Societe | null = null;
  user:any;

  message:string;

  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  errorMessage: string | null = null;
  importResult: ImportOperationResultDTO | null = null;

  exerciceEnCours?: ExerciceComptable;
  exerciceId:any;
  constructor(
    private operationService: OperationService,
    private tiersService:TiersService,
    private natureOperationService:NatureOperationService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private authService:AuthenticationService,
    private societeSelectionService: SocieteSelectionService,
    private modalService: NgbModal,
    private exerciceService: ExerciceComptableService
  ) {
      const userJson = localStorage.getItem("user");
      this.user = userJson ? JSON.parse(userJson) : null;
      this.operationForm = this.fb.group({
        id: [],
        montant: ['', Validators.required],
        details: [''],
        dateOperation: [''],
        natureOperationId: [null, Validators.required],
        natureOperationLibelle: [''],
        tiersId: [null, Validators.required],
        tiers: [''],
        societeId:[],
        societeNom:[''],
        comptableId:[this.user?.id],
        comptableNom:[''],
        exerciceId:[]
      });

      this.modelImportForm = this.fb.group({
        societeId: [],
        comptableId:[this.user?.id],
        fichierExcel: [null,Validators.required],
        exerciceId:[]
      });

      if(this.authService.isComptable( )){
        this.isComptable=true;
      }
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos opérations', path: '/', active: true }];
    this.init();
  }

  ajouter(): void {
    this.operationForm.reset();
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
      const currentData = this.lignes[this.selectedIndex].value as Operation;
      this.operationForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteOperation(currentData);
    }
  }

  edit(operation: Operation): void {
    this.selected = { ...operation };
    this.operationForm.patchValue(this.selected);
    this.formVisible = true;
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.operationForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as Operation;
    this.operationForm.setValue(currentData);
    this.selected = currentData;
  }

  enregistrer(): void {
    if (this.operationForm.invalid) {
      this.showWarning('Formulaire invalide');
      return;
    }

    if (!this.societeActive) {
      this.showWarning("Veuillez sélectionner une société.");
      return;
    }

    this.operationForm.patchValue({
      societeId: this.societeActive.id,
      comptableId:this.user?.id,
      exerciceId:this.exerciceId
    });

    this.isLoading = true;

    const operation = this.operationForm.value as Operation;
    // console.log(operation);
    // return;
    const action$ = this.selected?.id
      ? this.operationService.update(this.selected.id, operation)
      : this.operationService.create(operation);

    action$.subscribe({
      next: () => {
        const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
        this.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.operationForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerOperations();
      },
      error: () => {
        this.loading = false;
        this.showError('Erreur serveur !!!');
      }
    });
  }

  private init(): void {
    this.societeSelectionService.selectedSociete$
      .pipe(
        takeUntil(this.destroy$),
        filter((s): s is Societe => !!s) // <- Type narrowing ici
      )
      .subscribe((societe) => {
        this.societeActive = societe;
        this.message = '';
        this.loadExerciceEnCours(societe.id!);
      });
  }
  
  
  private loadExerciceEnCours(societeId: number): void {
  this.exerciceService.getExerciceEnCoursBySociete(societeId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: exercice => {
        if (exercice && exercice.id !== undefined) {
          this.exerciceEnCours = exercice;
          this.exerciceId = exercice.id;
          this.message = '';
          //this.chargerToutesLesDonnees();
        } else {
          this.exerciceEnCours = undefined;
          this.exerciceId = undefined;
          this.message = "Aucun exercice en cours pour la société sélectionnée.";
        }
      },
      error: () => {
        this.exerciceEnCours = undefined;
        this.exerciceId = undefined;
        this.message = "Erreur lors de la récupération de l'exercice en cours.";
      }
    });
}

  
  // private chargerToutesLesDonnees(): void {
  //   this.result = false;
  //   this.isLoading = true;

  //   // Vérification si societeActive existe et a un id
  //   const societeId = this.societeActive?.id;
  //   if (societeId === undefined) {
  //     this.message = "Aucune société active sélectionnée.";
  //     this.isLoading = false;
  //     return;
  //   }

  //   forkJoin({
  //     operations: this.operationService.getByFilters(societeId, 'RECETTE', 'RECETTE'),
  //     tiers: this.tiersService.getBySocieteAndType(societeId, 'CLIENT'),
  //     natureOperations: this.natureOperationService.getByFilters(societeId, 'RECETTE', 'RECETTE')
  //   }).pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: ({ operations, tiers, natureOperations }) => {
  //         this.operations = operations.map(op =>
  //           this.fb.group({
  //             id: [op.id],
  //             montant: [op.montant, Validators.required],
  //             details: [op.details],
  //             dateOperation: [op.dateOperation],
  //             natureOperationId: [op.natureOperationId, Validators.required],
  //             natureOperationLibelle: [op.natureOperationLibelle, Validators.required],
  //             tiersId: [op.tiersId, Validators.required],
  //             tiers: [op.tiers, Validators.required],
  //             societeId: [op.societeId],
  //             societeNom: [op.societeNom],
  //             comptableId: [op.comptableId],
  //             comptableNom: [op.comptableNom]
  //           })
  //         );

  //         this.tiers = (tiers as Tiers[])
  //           .filter(t => t.id !== undefined)
  //           .map(t => ({ value: t.id as number, label: t.intitule }));


  //         this.natureOperations = (natureOperations as OperationDto[])
  //         .filter(n => n.id !== undefined)
  //         .map(n => ({ value: n.id as number, label: n.libelle }));

  //         this.lignes = this.operations;
  //         this.result = true;
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         console.error('Erreur de chargement des données', err);
  //         this.showError('Erreur lors du chargement des données');
  //         this.result = true;
  //         this.isLoading = false;
  //       }
  //     });
  // }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  chargerOperations(): void {
    this.operations = [];
    this.operationService.getByFilters(this.societeActive?.id, 'RECETTE', 'RECETTE')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Operation[]) => {
        this.operations = data.map(d =>
          this.fb.group({
            id: [d.id],
            montant: [d.montant, Validators.required],
            details: [d.details],
            dateOperation: [d.dateOperation],
            natureOperationId: [d.natureOperationId, Validators.required],
            natureOperationLibelle: [d.natureOperationLibelle, Validators.required],
            tiersId: [d.tiersId, Validators.required],
            tiers: [d.tiers, Validators.required],
            societeId:[d.societeId],
            societeNom:[d.societeNom],
            comptableId:[d.comptableId],
            comptableNom:[d.comptableNom]
          })
        );
        this.lignes = this.operations;
        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement des natures opérations', error);
        this.result = true;
        
        this.showError('Erreur de chargement');
      }
    });
  }

  chargerTiers() {
    const societeId = this.societeActive?.id;
    if (societeId === undefined) {
      this.message = "Aucune société active sélectionnée.";
      this.isLoading = false;
      return;
    }

    this.tiersService.getBySocieteAndType(societeId, 'CLIENT')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Tiers[]) => {
          this.tiers =  data
          .filter(d => d.id !== undefined)
          .map(d => ({ value: d.id as number, label: d.intitule }));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des tiers', error);
          this.showError("Erreur lors du chargement des tiers.");
          this.isLoading = false;
        }
      });
  }


  // chargerNatureOperations() {
  //   const societeId = this.societeActive?.id;
  //   if (societeId === undefined) {
  //     this.message = "Aucune société active sélectionnée.";
  //     this.isLoading = false;
  //     return;
  //   }

  //   this.natureOperationService.getByFilters(societeId, 'RECETTE', 'RECETTE')
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data: OperationDto[]) => {
  //         this.natureOperations = data
  //           .filter(n => n.id !== undefined)
  //           .map(n => ({ value: n.id as number, label: n.libelle }));
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Erreur lors du chargement des natures opérations', error);
  //         this.showError("Erreur lors du chargement des natures opérations.");
  //         this.isLoading = false;
  //       }
  //     });
  // }


  deleteOperation(operation: Operation): void {
    Swal.fire({
      title: 'Supprimer l\' Opération',
      html: `
        <p><strong>Operation : </strong><span style="color: #009879; font-size: 1.2em;">${operation.natureOperationLibelle}</span></p>
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
        this.operationService.delete(operation.id!).subscribe({
          next: () => {
            this.operations = [];
            this.chargerOperations();
            Swal.fire('Succès', 'Operation supprimée avec succès.', 'success');
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

  handleFile(file: File): void {
    if (!file) return;
  
    const validExtensions = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();
  
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
  
    if (!isValid) {
      this.fileError = 'Seuls les fichiers Excel (.xls, .xlsx) sont autorisés.';
      this.showError(this.fileError);
      this.modelImportForm.patchValue({ fichierExcel: null });
      return;
    }
  
    this.fileError = null;
    this.modelImportForm.patchValue({ fichierExcel: file });
    this.modelImportForm.get('fichierExcel')?.updateValueAndValidity();
    this.updateFileNameDisplay(file.name);
  }

  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
  
    if (!file) return;
  
    this.handleFile(file);
  }

  updateFileNameDisplay(fileName: string | null): void {
    const fileNameElement = document.querySelector('.file-name') as HTMLElement;
    if (fileNameElement) {
      fileNameElement.textContent = fileName || 'Aucun fichier choisi';
    }
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
  

    if (!this.societeActive) {
      this.showWarning("Veuillez sélectionner une société.");
      return;
    }

    this.modelImportForm.patchValue({
      societeId: this.societeActive.id,
      comptableId:this.user?.id,
      exerciceId:this.exerciceId
    });
    this.isLoading = true;
    this.importResult = null;
  
    const formData = new FormData();
    const societeId = this.modelImportForm.value.societeId;
    const comptableId = this.modelImportForm.value.comptableId;
    const exerciceId = this.modelImportForm.value.exerciceId;
    const otherData = { ...this.modelImportForm.value };
    delete otherData.fichierExcel;
  
    formData.append('societeId', societeId);
    formData.append('comptableId', comptableId);
    formData.append('exerciceId', exerciceId);
    //formData.append('modelImport', new Blob([JSON.stringify(otherData)], { type: 'application/json' }));
    formData.append('fichierExcel', file);
  
    this.operationService.importerOperations(formData).subscribe({
      next: (result) => {
        this.lignes=[];
        this.chargerOperations();
        this.importResult = result;
        this.isLoading = false;
        console.log(result)
        if (result.success) {
          this.showSuccess(`${result.message} (${result.lignesImportees} operations importées)`);
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

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('dragover');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
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