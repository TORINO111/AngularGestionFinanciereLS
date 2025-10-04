import { SocieteService } from 'src/app/services/societe/societe.service';
import { Societe } from 'src/app/models/societe.model';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TiersService } from 'src/app/services/tiers/tiers.service';
import { Tiers } from 'src/app/models/tiers.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { CompteComptableDTO } from 'src/app/models/compte-comptable';

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
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('importExcelModal', { static: true }) importExcelModal!: TemplateRef<any>;

  @ViewChild('searchInputLibelle', { static: true }) searchInputLibelle!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInputTel', { static: true }) searchInputTel!: ElementRef<HTMLInputElement>;

  closeResult: string = '';
  tiers: Tiers[] = [];
  lignes: any[] = [];
  societes: any[] = [];
  types = [{ id: 'CLIENT', libelle: 'CLIENT' }, { id: 'FOURNISSEUR', libelle: 'FOURNISSEUR' }, { id: 'SALARIE', libelle: 'SALARIE' }];

  comptesCollectifs: any[];

  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  private search$ = new Subject<{ intitule: string, tel: string, type: string }>();
  searchIntitule: string;
  searchTelTiers: string;
  selectedType: string;

  selectedIndex: number | null = null;
  tiersForm!: UntypedFormGroup;
  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  importResult: ImportTiersResultDTO | null = null;
  errorMessage: string | null = null;

  pageTitle: BreadcrumbItem[] = [];
  isLoading = false;
  formVisible = false;
  result = false;
  currentUser: any;
  currentSociete: Societe;
  isFormReady = false;
  societeBi: Societe;
  comptes: CompteComptableDTO[];

  constructor(
    private tiersService: TiersService,
    private societeService: SocieteService,
    private notification: NotificationService,
    private fb: UntypedFormBuilder,
    private compteComptableService: CompteComptableService,
    private modalService: NgbModal
  ) {
    this.tiersForm = this.fb.group({
      id: [''],
      intitule: ['', Validators.required],
      compteCollectifId: ['', Validators.required],
      interlocuteur: [''],
      telephoneInterlocuteur: [''],
      telephoneTiers: [''],
      type: ['', Validators.required],
      societeId: [null]
    });

    this.modelImportForm = this.fb.group({
      societeId: [null],
      fichierExcel: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos tiers', path: '/', active: true }];
    const societeActiveStr = localStorage.getItem("societeActive");
    if (societeActiveStr) {
      this.societeBi = JSON.parse(societeActiveStr);
      this.tiersForm.patchValue({ societeId: this.societeBi.id });
      this.modelImportForm.patchValue({ societeId: this.societeBi.id });
    }
    this.chargerSocietes();
    this.chargerTiers();
    this.chargerComptesComptables();
    this.initSearchListener();
  }

  chargerTiers(page: number = 0): void {
    this.result = false;
    this.isLoading = true;

    this.currentPage = page;

    this.tiersService.getAllPageable(
      page,
      this.pageSize,
      this.searchIntitule || undefined,
      this.searchTelTiers || undefined,
      this.selectedType || undefined
    ).subscribe({
      next: (data: any) => {
        this.tiers = data.content;
        this.lignes = [...this.tiers];
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;
      },
      error: () => {
        this.result = true;
        this.isLoading = false;
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  chargerComptesComptables() {
    this.compteComptableService.getAll().subscribe({
      next: (data: CompteComptableDTO[]) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes comptables', err);
        this.notification.showError('Erreur lors du chargement des comptes comptables');
      }
    });
  }

  searchFn(term: string, item: any) {
    if (!term) return true;
    term = term.toLowerCase();
    return item.code.toLowerCase().includes(term) ||
      item.intitule.toLowerCase().includes(term);
  }

  chargerSocietes() {
    this.societes = [];
    this.societeService.getAllSociete().subscribe({
      next: (data: Societe[]) => this.societes = data.map(d => ({ id: d.id, nom: d.nom })),
      error: () => this.notification.showError('Erreur lors du chargement des sociétés')
    });
  }

  ajouter(): void {
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) this.formVisible = true;
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const tier = this.lignes[this.selectedIndex];
      this.deleteTiers(tier.value);
    }
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[index].value as Tiers;
    this.tiersForm.setValue(currentData);
  }

  enregistrer(): void {
    console.log(this.tiersForm.value);
    if (this.tiersForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }
    this.isLoading = true;
    const tierData = {
      ...this.tiersForm.value,
      societeId: this.societeBi.id
    } as Tiers;

    const action$ = tierData.id
      ? this.tiersService.update(tierData.id, tierData)
      : this.tiersService.create(tierData);

    action$.subscribe({
      next: () => {
        const msg = tierData.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.selectedIndex = null;
        this.lignes = [];
        this.isLoading = false;
        this.chargerTiers();
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.showError(err);
      }
    });
  }

  deleteTiers(tiers: Tiers): void {
    Swal.fire({
      title: 'Supprimer le tiers',
      html: `<p><strong>Tiers : </strong><span style="color: #009879; font-size: 1.2em;">${tiers.intitule}</span></p>`,
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-secondary' },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        this.tiersService.delete(tiers.id!).subscribe({
          next: () => {
            this.lignes = [];
            this.chargerTiers();
            this.notification.showSuccess('Tiers supprimé avec succès !');
          },
          error: () => this.notification.showError('Erreur lors de la suppression')
        });
      }
    });
  }

  deleteTiersConfirm(index: number): void {
    const tiers = this.lignes[index].value;

    Swal.fire({
      title: 'Supprimer le cabinet',
      html: `<p><strong>Cabinet : </strong><span style="color: #009879; font-size: 1.2em;">${tiers.intitule}</span></p>`,
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
        this.tiersService.delete(tiers.id!).subscribe({
          next: () => {
            this.lignes.splice(index, 1);
            Swal.fire('Succès', 'Tiers supprimé avec succès.', 'success');
          },
          error: (err) => {
            const msg = err.error?.message || err.message || 'Une erreur est survenue.';
            Swal.fire('Erreur', msg, 'error');
          }
        });
      }
    });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    this.chargerTiers(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const validExtensions = ['.xls', '.xlsx'];
    if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      this.fileError = 'Seuls les fichiers Excel (.xls, .xlsx) sont autorisés.';
      this.notification.showError(this.fileError);
      input.value = '';
      this.modelImportForm.patchValue({ fichierExcel: null });
      return;
    }

    this.fileError = null;
    this.modelImportForm.patchValue({ fichierExcel: file });
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

    const formData = new FormData();
    formData.append('societeId', this.modelImportForm.value.societeId);
    formData.append('fichierExcel', file);

    this.isLoading = true;
    this.importResult = null;

    this.tiersService.importerTiers(formData).subscribe({
      next: (result) => {
        this.lignes = [];
        this.chargerTiers();
        this.importResult = result;
        this.isLoading = false;
        if (result.success) {
          this.notification.showSuccess(`${result.message} (${result.lignesImportees} tiers importés)`);
        } else {
          this.notification.showError(`${result.message} (${result.erreurs.length} erreurs détectées)`);
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de l’import.';
        this.notification.showError(msg);
        this.importResult = { success: false, message: msg, lignesImportees: 0, erreurs: [] };
        this.isLoading = false;
      }
    });
  }

  openScrollableModal(content: TemplateRef<NgbModal>) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true, backdrop: 'static', keyboard: false });
  }

  openModal() {
    this.formVisible = true;
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
  }

  editTiers(index: number) {
    this.selectedIndex = index;
    const tierBi = this.lignes[index] as Tiers;
    this.tiersForm.patchValue(tierBi);
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  private initSearchListener() {
    this.search$.pipe(
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(({ intitule, tel, type }) => this.tiersService.getAllPageable(
        0,
        this.pageSize,
        intitule || undefined,
        tel || undefined,
        type || undefined
      ))
    ).subscribe({
      next: data => {
        this.lignes = data.content;
        this.totalElements = data.totalElements;
        this.currentPage = 0;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        console.error('Erreur lors de la recherche', err)
      }
    });
  }

  onFilterChange(): void {
    this.search$.next({ intitule: this.searchIntitule, tel: this.searchTelTiers, type: this.selectedType });
  }
}
