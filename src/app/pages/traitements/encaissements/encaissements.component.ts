import { Component, OnInit,ViewChild,TemplateRef  } from '@angular/core';
import {UntypedFormGroup,Validators,UntypedFormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NatureOperationDto } from 'src/app/models/nature-operation.model';
import { NatureOperationService } from 'src/app/services/nature-operation/nature-operation.service';
import { Operation } from 'src/app/models/operation.model';
import { OperationService } from 'src/app/services/operations/operation.service';
import { Tiers } from 'src/app/models/tiers.model';
import { TiersService } from 'src/app/services/tiers/tiers.service';
import { Select2Data } from 'ng-select2-component';
import { forkJoin, Subject } from 'rxjs';
import { Societe } from 'src/app/models/societe.model';
import { SocieteSelectionService } from 'src/app/services/societe-selection/societe-selection.service';
import { ExerciceComptable } from '../../../models/exercice-comptable.model';
import { ExerciceSelectionService } from 'src/app/services/exercices-selection/exercice-selection.service';
import { ExerciceComptableService } from 'src/app/services/exercices-comptables/exercice-comptable.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-encaissements',
    templateUrl: './encaissements.component.html',
    styleUrls: ['./encaissements.component.scss'],
    standalone: false
})
export class EncaissementsComponent implements OnInit {
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
  societeActive?: Societe;

  user?:any;
  exerciceEnCours?: ExerciceComptable;
  exerciceId?:number;
  message:string;
  private destroy$ = new Subject<void>();
  constructor(
    private operationService: OperationService,
    private tiersService:TiersService,
    private natureOperationService:NatureOperationService,
    private fb: UntypedFormBuilder,
    private societeSelectionService: SocieteSelectionService,
    private toastr: ToastrService,
    private exerciceService: ExerciceComptableService,
    private exerciceSelectionService: ExerciceSelectionService
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
      tiersId: [null],
      tiers: [''],
      societeId:[],
      societeNom:[''],
      comptableId:[this.user?.id],
      comptableNom:[''],
      exerciceId:[]
    });
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
    // console.log(this.operationForm.value)

    // return;
    this.isLoading = true;

    const operation = this.operationForm.value as Operation;

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
          if (exercice) {
            this.exerciceEnCours = exercice;
            this.exerciceId = exercice.id;
            this.message = '';
            this.chargerToutesLesDonnees();
          } else {
            this.exerciceEnCours = undefined;
            this.message = "Aucun exercice en cours pour la société sélectionnée.";
          }
        },
        error: () => {
          this.exerciceEnCours = undefined;
          this.message = "Erreur lors de la récupération de l'exercice en cours.";
        }
      });
  }

 chargerToutesLesDonnees(): void {
  this.result = false;
  this.isLoading = true;

  const societeId = this.societeActive?.id;
  if (societeId === undefined) {
    this.message = "Aucune société active sélectionnée.";
    this.isLoading = false;
    return;
  }

  forkJoin({
    operations: this.operationService.getByFilters(societeId, 'ENCAISSEMENT', 'TRESORERIE'),
    tiers: this.tiersService.getBySocieteAndType(societeId, 'CLIENT'),
    natureOperations: this.natureOperationService.getByFilters(societeId, 'ENCAISSEMENT', 'TRESORERIE')
  }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ operations, tiers, natureOperations }) => {
        // 1. Préparer les lignes (formulaires dynamiques)
        this.operations = operations.map(d =>
          this.fb.group({
            id: [d.id],
            montant: [d.montant, Validators.required],
            details: [d.details],
            dateOperation: [d.dateOperation],
            natureOperationId: [d.natureOperationId, Validators.required],
            natureOperationLibelle: [d.natureOperationLibelle, Validators.required],
            tiersId: [d.tiersId],
            tiers: [d.tiers],
            societeId: [d.societeId],
            societeNom: [d.societeNom],
            comptableId: [d.comptableId],
            comptableNom: [d.comptableNom]
          })
        );
        this.lignes = this.operations;

        // 2. Charger les tiers dans dropdown
        this.tiers = (tiers as Tiers[])
          .filter(t => t.id !== undefined)
          .map(t => ({ value: t.id as number, label: t.intitule }));

        // 3. Charger les natureOperations dans dropdown
        this.natureOperations = (natureOperations as NatureOperationDto[])
          .filter(n => n.id !== undefined)
          .map(n => ({ value: n.id as number, label: n.libelle }));

        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de chargement des données', error);
        this.showError('Erreur lors du chargement des données');
        this.result = true;
        this.isLoading = false;
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  chargerOperations(): void {
    this.operations = [];
    this.operationService.getByFilters(this.societeActive?.id, 'ENCAISSEMENT', 'TRESORERIE').subscribe({
      next: (data: Operation[]) => {
        console.log(data)
        this.operations = data.map(d =>
          this.fb.group({
            id: [d.id],
            montant: [d.montant, Validators.required],
            details: [d.details],
            dateOperation: [d.dateOperation],
            natureOperationId: [d.natureOperationId, Validators.required],
            natureOperationLibelle: [d.natureOperationLibelle, Validators.required],
            tiersId: [d.tiersId],
            tiers: [d.tiers],
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
        // Filtrer pour garder uniquement les éléments avec un id défini
        this.tiers = data
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


  chargerNatureOperations() {
    const societeId = this.societeActive?.id;
    if (societeId === undefined) {
      this.message = "Aucune société active sélectionnée.";
      this.isLoading = false;
      return;
    }

    this.natureOperationService.getByFilters(societeId, 'ENCAISSEMENT', 'TRESORERIE')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: NatureOperationDto[]) => {
          // Filtrer pour éviter les ids undefined
          this.natureOperations = data
            .filter(n => n.id !== undefined)
            .map(n => ({ value: n.id as number, label: n.libelle }));

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des natures opérations', error);
          this.showError("Erreur lors du chargement des natures opérations.");
          this.isLoading = false;
        }
      });
  }


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



