import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { ImportComptesComptablesResultDTO, PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-comptes-comptables',
  templateUrl: './comptes-comptables.component.html',
  styleUrl: './comptes-comptables.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ComptesComptablesComponent implements OnInit {

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  @ViewChild('searchIntituleChamp', { static: true }) searchIntituleChamp!: ElementRef<HTMLInputElement>;
  @ViewChild('searchCodeChamp', { static: true }) searchCodeChamp!: ElementRef<HTMLInputElement>;

  comptes: UntypedFormGroup[] = [];
  lignes: any[] = [];
  plansComptables: any[] = [];
  selectedIndex: number | null = null;
  pageTitle: BreadcrumbItem[] = [];

  totalElements: number = 0;
  pageSize: number = 4;
  currentPage: number = 0;
  private search$ = new Subject<{ code: string, intitule: string, plan: number }>();
  searchIntitule: string = '';
  searchCode: string = '';
  selectedPlan: number;


  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  errorMessage: string | null = null;
  importResult: ImportComptesComptablesResultDTO | null = null;
  closeResult: string = '';

  compteForm: UntypedFormGroup;
  formVisible = false;
  isLoading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private compteService: CompteComptableService,
    private planService: PlanComptableService,
    private notification: NotificationService,
    private planComptableService: PlanComptableService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.compteForm = this.fb.group({
      id: [''],
      code: ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],
      intitule: ['', [Validators.required, Validators.minLength(3)]],
      planComptableId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos comptes comptables', path: '/', active: true }];
    this.loadPlansComptables();
    this.chargerComptesComptables();
    this.initSearchListener()
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // 48-57 correspond aux touches 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  loadComptes(): void {
    this.isLoading = true;
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data.map(d => this.fb.group({
          id: [d.id],
          code: [d.code],
          intitule: [d.intitule],
          planComptableId: [d.planComptableId],
          planComptableLibelle: [d.planComptableLibelle],
          classeCompte: [d.classeCompte]
        }));
        this.lignes = this.comptes;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur chargement comptes');
        this.isLoading = false;
      }
    });
  }

  loadPlansComptables(): void {
    this.planService.getAll().subscribe({
      next: (data) => {
        this.plansComptables = data.map(p => ({ id: p.id, intitule: p.intitule }));
        console.log('Plans chargés:', this.plansComptables);
      },
      error: (err) => console.error('Erreur plans', err)
    });
  }


  openScrollableModal(content: TemplateRef<NgbModal>): void {
    //this.codeBudgetaireForm.reset();
    this.modalService.open(content,
      {
        size: '', // set modal size
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
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
        // this.chargerPlanAnalytiques();
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

  openModal(): void {
    this.formVisible = true;
    this.compteForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  editCompte(index: number): void {
    this.selectedIndex = index;
    const compte = this.lignes[index];
    console.log(compte);
    this.compteForm.patchValue(compte);

    this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
  }

  deleteCompte(index: number): void {
    const compte = this.lignes[index].value;
    if (!compte?.id) return;
    if (!confirm(`Voulez-vous vraiment supprimer le compte "${compte.intitule}" ?`)) return;

    this.compteService.delete(compte.id).subscribe({
      next: () => {
        this.toastr.success('Compte supprimé avec succès');
        this.loadComptes();
      },
      error: () => this.toastr.error('Erreur suppression compte')
    });
  }

  saveCompte(): void {
    if (this.compteForm.invalid) {
      this.toastr.warning('Formulaire invalide');
      return;
    }
    const formValue = this.compteForm.value as CompteComptableDTO;
    const action$ = formValue.id
      ? this.compteService.update(formValue.id, formValue)
      : this.compteService.create(formValue);

    action$.subscribe({
      next: () => {
        this.toastr.success(`Compte ${formValue.id ? 'modifié' : 'créé'} avec succès`);
        this.compteForm.reset();
        this.formVisible = false;
        this.selectedIndex = null;
        this.loadComptes();
        this.modalService.dismissAll();
      },
      error: () => this.toastr.error('Erreur lors de l\'enregistrement')
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.compteForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }

  chargerComptesComptables(page: number = 0): void {
    this.plansComptables = [];
    this.currentPage = page;

    this.compteService.getAllCompteComptablePageable(page,
      this.pageSize,
      this.searchCode ? this.searchCode : undefined,
      this.searchIntitule ? this.searchIntitule : undefined,
      this.selectedPlan ? this.selectedPlan : undefined,
    ).subscribe({
      next: (data: any) => {
        this.plansComptables = data.content;
        this.lignes = [...this.plansComptables];
        this.totalElements = data.totalElements;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plans comptables', error);
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number = 0) {
    this.chargerComptesComptables(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  onFilterChange(): void {
    this.search$.next({ code: this.searchCode, intitule: this.searchIntitule, plan: this.selectedPlan });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ code, intitule, plan }) => {
          this.currentPage = 0;
          return this.compteService.getAllCompteComptablePageable(
            0,
            this.pageSize,
            code || undefined,
            intitule || undefined,
            plan || undefined,
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
