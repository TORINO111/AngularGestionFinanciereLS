import { Component, OnInit,ViewChild,TemplateRef  } from '@angular/core';
import {UntypedFormGroup,Validators,UntypedFormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OperationDto } from 'src/app/models/operation.model';
import { NatureOperationService } from 'src/app/services/operations/operations.service';
import { Operation } from 'src/app/models/operationRevoke.model';
import { OperationService } from 'src/app/services/operationsRevolu/operation.service';
import { Tiers } from 'src/app/models/tiers.model';
import { TiersService } from 'src/app/services/tiers/tiers.service';
import { Select2Data } from 'ng-select2-component';
import { forkJoin, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { Societe } from 'src/app/models/societe.model';
import { SocieteSelectionService } from 'src/app/services/societe-selection/societe-selection.service';
import { filter, takeUntil } from 'rxjs/operators';
import { ExerciceComptable } from '../../../models/exercice-comptable.model';
import { ExerciceComptableService } from 'src/app/services/exercices-comptables/exercice-comptable.service';
@Component({
    selector: 'app-salaires',
    templateUrl: './salaires.component.html',
    styleUrls: ['./salaires.component.scss'],
    standalone: false
})
export class SalairesComponent implements OnInit {

  private destroy$ = new Subject<void>();
  operationList: Operation[] = [];
  selected?: Operation;

  // Utilisation de FormGroup[] avec typage clair
  operations: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  natureOperations: Select2Data = [];
  tiers: Select2Data = [];

  selectedIndex: number | null = null;
  operationForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;
  isComptable=false;
  user:any;
  societeActive: Societe | null = null;

  exerciceEnCours?: ExerciceComptable;
  exerciceId?:number;
  message:string;

  constructor(
    private operationService: OperationService,
    private tiersService:TiersService,
    private natureOperationService:NatureOperationService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private societeSelectionService: SocieteSelectionService,
    private authService:AuthenticationService,
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
      comptableNom:['']
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
//     if(this.authService.isComptable( )){
//       this.isComptable=true;
//     }
//   }

//   ngOnInit(): void {
//     this.pageTitle = [{ label: 'Vos opérations', path: '/', active: true }];
//     this.init();
//   }

//   ajouter(): void {
//     this.operationForm.reset();
//     this.formVisible = true;
//     this.selectedIndex = null;
//   }

//   modifier(): void {
//     if (this.selectedIndex !== null) {
//       this.formVisible = true;
//     }
//   }

//   supprimer(): void {
//     if (this.selectedIndex !== null) {
//       const currentData = this.lignes[this.selectedIndex].value as Operation;
//       this.operationForm.setValue(currentData);
//       this.lignes.splice(this.selectedIndex, 1);
//       this.selectedIndex = null;
//       this.deleteOperation(currentData);
//     }
//   }

//   edit(operation: Operation): void {
//     this.selected = { ...operation };
//     this.operationForm.patchValue(this.selected);
//     this.formVisible = true;
//   }

//   fermer(): void {
//     this.formVisible = false;
//     this.selectedIndex = null;
//     this.operationForm.reset();
//   }

//   selectLigne(index: number): void {
//     this.selectedIndex = index;
//     const currentData = this.lignes[this.selectedIndex].value as Operation;
//     this.operationForm.setValue(currentData);
//     this.selected = currentData;
//   }

//   enregistrer(): void {
//     if (this.operationForm.invalid) {
//       this.showWarning('Formulaire invalide');
//       return;
//     }

//     if (!this.societeActive) {
//       this.showWarning("Veuillez sélectionner une société.");
//       return;
//     }

//     this.operationForm.patchValue({
//       societeId: this.societeActive.id,
//       comptableId:this.user?.id
//     });

//     this.isLoading = true;

//     const operation = this.operationForm.value as Operation;

//     const action$ = this.selected?.id
//       ? this.operationService.update(this.selected.id, operation)
//       : this.operationService.create(operation);

//     action$.subscribe({
//       next: () => {
//         const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
//         this.showSuccess(`${msg} avec succès`);
//         this.formVisible = false;
//         this.operationForm.reset();
//         this.loading = false;
//         this.selectedIndex = null;
//         this.selected = undefined;
//         this.lignes = [];
//         this.chargerOperations();
//       },
//       error: () => {
//         this.loading = false;
//         this.showError('Erreur serveur !!!');
//       }
//     });
//   }

//   private init(): void {
//     this.societeSelectionService.selectedSociete$
//       .pipe(
//         takeUntil(this.destroy$),
//         filter((s): s is Societe => !!s) // <- Type narrowing ici
//       )
//       .subscribe((societe) => {
//         this.societeActive = societe;
//         this.message = '';
//         this.loadExerciceEnCours(societe.id!);
//       });
//   }
  
  
//   private loadExerciceEnCours(societeId: number): void {
//     this.exerciceService.getExerciceEnCoursBySociete(societeId)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: exercice => {
//           if (exercice) {
//             this.exerciceEnCours = exercice;
//             this.exerciceId = exercice.id;
//             this.message = '';
//             this.chargerToutesLesDonnees();
//           } else {
//             this.exerciceEnCours = undefined;
//             this.message = "Aucun exercice en cours pour la société sélectionnée.";
//           }
//         },
//         error: () => {
//           this.exerciceEnCours = undefined;
//           this.message = "Erreur lors de la récupération de l'exercice en cours.";
//         }
//       });
//   }

//   chargerToutesLesDonnees(): void {
//   this.result = false;
//   this.isLoading = true;

//   // Vérification que societeActive et son id existent
//   const societeId = this.societeActive?.id;
//   if (!societeId) {
//     this.message = "Aucune société active sélectionnée.";
//     this.isLoading = false;
//     return;
//   }

//   forkJoin({
//     operations: this.operationService.getByFilters(societeId, 'SALAIRE', 'SALAIRE'),
//     tiers: this.tiersService.getBySocieteAndType(societeId, 'SALARIE'),
//     natureOperations: this.natureOperationService.getByFilters(societeId, 'SALAIRE', 'SALAIRE')
//   })
//   .pipe(takeUntil(this.destroy$))
//   .subscribe({
//     next: ({ operations, tiers, natureOperations }) => {
//       // 1️⃣ Préparer les lignes (formulaires dynamiques)
//       this.operations = operations.map(d =>
//         this.fb.group({
//           id: [d.id],
//           montant: [d.montant, Validators.required],
//           details: [d.details],
//           dateOperation: [d.dateOperation],
//           natureOperationId: [d.natureOperationId, Validators.required],
//           natureOperationLibelle: [d.natureOperationLibelle, Validators.required],
//           tiersId: [d.tiersId, Validators.required],
//           tiers: [d.tiers, Validators.required],
//           societeId: [d.societeId],
//           societeNom: [d.societeNom],
//           comptableId: [d.comptableId],
//           comptableNom: [d.comptableNom]
//         })
//       );
//       this.lignes = this.operations;

//       // 2️⃣ Charger les tiers dans dropdown
//       this.tiers = [{
//         label: '',
//         options: (tiers as Tiers[]).map(t => ({
//           value: t.id,
//           label: t.intitule
//         }))
//       }];

//       // 3️⃣ Charger les natureOperations dans dropdown
//       this.natureOperations = [{
//         label: '',
//         options: (natureOperations as OperationDto[]).map(n => ({
//           value: n.id,
//           label: n.libelle
//         }))
//       }];

//       this.result = true;
//       this.isLoading = false;
//     },
//     error: (error) => {
//       console.error('Erreur de chargement des données', error);
//       this.showError('Erreur lors du chargement des données');
//       this.result = true;
//       this.isLoading = false;
//     }
//   });
// }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   chargerOperations(): void {
//     this.operations = [];

//     const societeId = this.societeActive?.id;
//     if (!societeId) {
//       this.message = "Aucune société active sélectionnée.";
//       this.isLoading = false;
//       return;
//     }

//     this.operationService.getByFilters(societeId, 'SALAIRE', 'SALAIRE').subscribe({
//       next: (data: Operation[]) => {
//         console.log(data)
//         this.operations = data.map(d =>
//           this.fb.group({
//             id: [d.id],
//             montant: [d.montant, Validators.required],
//             details: [d.details],
//             dateOperation: [d.dateOperation],
//             natureOperationId: [d.natureOperationId, Validators.required],
//             natureOperationLibelle: [d.natureOperationLibelle, Validators.required],
//             tiersId: [d.tiersId, Validators.required],
//             tiers: [d.tiers, Validators.required],
//             societeId: [d.societeId],
//             societeNom: [d.societeNom],
//             comptableId: [d.comptableId],
//             comptableNom: [d.comptableNom]
//           })
//         );
//         this.lignes = this.operations;
//         this.result = true;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.isLoading = false;
//         console.error('Erreur lors du chargement des opérations', error);
//         this.result = true;
//         this.showError('Erreur de chargement');
//       }
//     });
//   }


//   chargerTiers(): void {
//     const societeId = this.societeActive?.id;
//     if (!societeId) {
//       this.message = "Aucune société active sélectionnée.";
//       return;
//     }

//     this.tiersService.getBySocieteAndType(societeId, 'SALARIE').subscribe(
//       (data: Tiers[]) => {
//         console.log(data);
//         this.tiers = [{
//           label: '',
//           options: data.map(d => ({ value: d.id, label: d.intitule }))
//         }];
//         this.isLoading = false;
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Erreur lors du chargement des tiers', error);
//         this.showError("Erreur lors du chargement des tiers");
//       }
//     );
//   }


//   chargerNatureOperations(): void {
//     const societeId = this.societeActive?.id;
//     if (!societeId) {
//       this.message = "Aucune société active sélectionnée.";
//       return;
//     }

//     this.natureOperationService.getByFilters(societeId, 'SALAIRE', 'SALAIRE').subscribe(
//       (data: OperationDto[]) => {
//         this.natureOperations = [{
//           label: '',
//           options: data.map(d => ({ value: d.id, label: d.libelle }))
//         }];
//         this.isLoading = false;
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Erreur lors du chargement des natures opérations', error);
//         this.showError("Erreur lors du chargement des natures opérations");
//       }
//     );
//   }


//   deleteOperation(operation: Operation): void {
//     Swal.fire({
//       title: 'Supprimer l\' Opération',
//       html: `
//         <p><strong>Operation : </strong><span style="color: #009879; font-size: 1.2em;">${operation.natureOperationLibelle}</span></p>
//       `,
//       showCancelButton: true,
//       confirmButtonText: '<i class="fa fa-trash-alt"></i> Supprimer',
//       cancelButtonText: '<i class="fa fa-ban"></i> Annuler',
//       customClass: {
//         popup: 'swal2-custom-popup',
//         confirmButton: 'btn btn-danger',
//         cancelButton: 'btn btn-secondary'
//       },
//       buttonsStyling: false
//     }).then((result) => {
//       if (result.value) {
//         this.operationService.delete(operation.id!).subscribe({
//           next: () => {
//             this.operations = [];
//             this.chargerOperations();
//             Swal.fire('Succès', 'Operation supprimée avec succès.', 'success');
//           },
//           error: () => {
//             Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
//           }
//         });
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         Swal.fire('Abandonné', 'Suppression annulée', 'info');
//       }
//     });
//   }

//   showSuccess(message: string): void {
//     this.toastr.success(message, 'Succès', {
//       timeOut: 5000,
//       positionClass: 'toast-top-right',
//       progressBar: true,
//       closeButton: true
//     });
//   }

//   showError(message: string): void {
//     this.toastr.error(message, 'Erreur', {
//       timeOut: 5000,
//       positionClass: 'toast-top-right',
//       progressBar: true,
//       closeButton: true
//     });
//   }

//   showWarning(message: string): void {
//     this.toastr.warning(message, 'Attention', {
//       timeOut: 5000,
//       positionClass: 'toast-top-right',
//       progressBar: true,
//       closeButton: true
//     });
//   }
// }
