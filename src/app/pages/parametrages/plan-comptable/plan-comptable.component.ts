import { SocieteService } from 'src/app/services/societe/societe.service';
import { Societe } from 'src/app/models/societe.model';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { PlanComptable } from './../../../models/plan-comptable.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
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
  selector: 'app-plan-comptable',
  templateUrl: './plan-comptable.component.html',
  styleUrls: ['./plan-comptable.component.scss'],
  standalone: false
})
export class PlanComptableComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('importExcelModal', { static: true }) importExcelModal!: TemplateRef<any>;

  @ViewChild('searchInputLibelle', { static: true }) searchInputLibelle!: ElementRef<HTMLInputElement>;


  closeResult: string = '';
  plansComptablesList: PlanComptable[] = [];
  selected: boolean = false;

  plansComptables: any[] = [];
  lignes: any[] = [];
  societes: any[] = [];

  totalElements: number = 0;
  pageSize: number = 4;
  currentPage: number = 0;
  private search$ = new Subject<{ libelle: string }>();
  searchLibelle: string = '';

  selectedIndex: number | null = null;
  planComptableForm!: UntypedFormGroup;
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
    private societeService: SocieteService,
    private notification: NotificationService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
  ) {
    this.planComptableForm = this.fb.group({
      id: [''],
      intitule: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9 -]+$'),
      Validators.minLength(3)
      ]],
      code: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.maxLength(5)]]
    });
    this.modelImportForm = this.fb.group({
      fichierExcel: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'vos plans comptables', path: '/', active: true }];
    this.chargerPlanComptables();
    this.chargerSocietes();
    this.initSearchListener()
  }

  chargerSocietes() {
    this.societes = [];
    this.societeService.getAllSociete().subscribe({
      next: (data: Societe[]) => {
        this.societes = data.map(d => ({
          id: d.id,
          nom: d.nom,
        }));
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log('Erreur lors du chargement des sociétés', error);
        this.notification.showError("Erreur lors du chargement des sociétés");
      }
    });
  }

  ajouter(): void {
    this.planComptableForm.reset();
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
      const currentData = this.lignes[this.selectedIndex].value as PlanComptable;
      this.planComptableForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      //this.deletePlanComptable(currentData);
    }
  }

  enregistrer(): void {
    if (this.planComptableForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const formValue = this.planComptableForm.value;
    const planComptable: any = {
      id: formValue.id ?? null,
      intitule: formValue.intitule,
    };

    // Choisir create ou update selon présence d'un ID
    const action$ = planComptable.id
      ? this.planComptableService.update(planComptable.id, planComptable)
      : this.planComptableService.create(planComptable);

    action$.subscribe({
      next: () => {
        const msg = planComptable.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        // reset form et recharger
        this.formVisible = false;
        this.planComptableForm.reset();
        this.isLoading = false;
        this.selectedIndex = null;
        this.selected = false;
        this.lignes = [];
        this.chargerPlanComptables();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notification.showError(error);
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

    this.planComptableService.importerPlanComptable(formData).subscribe({
      next: (result) => {
        this.lignes = [];
        this.chargerPlanComptables();
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.planComptableForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }

  openModal(): void {
    this.formVisible = true;
    this.planComptableForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { centered: true });
  }

  editPlan(index: number): void {
    this.selectedIndex = index;
    const plan = this.plansComptables[index];
    this.planComptableForm.patchValue(plan);

    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  deletePlan(index: number): void {
    const plan = this.plansComptables[index];
    Swal.fire({
      title: 'Supprimer la section',
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
        this.planComptableService.delete(plan.id)
          .subscribe({
            next: () => {
              this.lignes.splice(index, 1);
              this.selectedIndex = null;
              this.notification.showSuccess('Plan comptable supprimé avec succès !');
            },
            error: (error) => this.notification.showError(error)
          });
      }
    });
  }

  chargerPlanComptables(page: number = 0): void {
    this.plansComptables = [];
    this.currentPage = page;

    this.planComptableService.getAllPageable(page,
      this.pageSize,
      this.searchLibelle ? this.searchLibelle : undefined,
    ).subscribe({
      next: (data: any) => {
        this.plansComptables = data.content;
        this.lignes = [...this.plansComptables];
        this.totalElements = data.totalElements;
        this.result = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plans comptables', error);
        this.result = true;
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number = 0) {
    this.chargerPlanComptables(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
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
          return this.planComptableService.getAllPlanAnalytiquePageable(
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
