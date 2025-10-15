import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { ImportComptesComptablesResultDTO, PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';

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

  comptes: FormGroup[] = [];
  lignes: any[] = [];
  plansComptables: any[] = [];
  selectedIndex: number | null = null;
  pageTitle: BreadcrumbItem[] = [];

  totalElements: number = 0;
  pageSize: number = 40;
  currentPage: number = 0;
  private search$ = new Subject<{ code: string, intitule: string, plan: number }>();
  searchIntitule: string = '';
  searchCode: string = '';
  selectedPlan: number;

  excelFile: File | null = null;
  fileError: string | null = null;
  errorMessage: string | null = null;
  importResult: ImportComptesComptablesResultDTO | null = null;
  closeResult: string = '';
  modelImportForm!: FormGroup;

  compteForm: FormGroup;
  formVisible = false;
  isLoading = false;

  selectedFile: File | null = null;
  http: any;
  societeBi: any;
  result = false;
  userBi: any;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteComptableService,
    private planService: PlanComptableService,
    private notification: NotificationService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.compteForm = this.fb.group({
      id: [''],
      code: ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],
      intitule: ['', [Validators.required, Validators.minLength(3)]],
      planComptableId: ['', Validators.required],
      societeId: [null],
      userId: [null]
    });
    this.modelImportForm = this.fb.group({
      fichierExcel: [null, Validators.required],
      planId: [null, Validators.required],
      societeId: [null]
    });
  }

  /**
   * Initialise le composant.
   * Configure le titre, charge les plans comptables et la liste des comptes,
   * et initialise l'écoute des changements de recherche.
   */
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos comptes comptables', path: '/', active: true }];
    this.loadPlansComptables();
    this.chargerComptesComptables();
    this.initSearchListener();

    const societeActiveStr = localStorage.getItem("societeActive");
    const userActive = localStorage.getItem("user");  

    if (societeActiveStr && userActive) {
      this.societeBi = JSON.parse(societeActiveStr);
      this.userBi = JSON.parse(userActive);
    };
  }

  /**
   * Autorise uniquement les chiffres dans un champ de saisie.
   * @param event événement clavier
   */
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /**
   * Charge tous les comptes comptables depuis le service.
   */
  loadComptes(): void {
    this.isLoading = true;
    this.lignes = [];
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

  /**
   * Charge tous les plans comptables depuis le service.
   */
  loadPlansComptables(): void {
    this.planService.getAll().subscribe({
      next: (data) => {
        this.plansComptables = data.map(p => ({ id: p.id, intitule: p.intitule }));
      },
      error: (err) => console.error('Erreur plans', err)
    });
  }

  /**
   * Ouvre un modal scrollable et centré.
   * @param content template du contenu du modal
   */
  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content,
      {
        size: '',
        centered: true, scrollable: true,
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  /**
   * Sélection d’un fichier Excel pour l’import.
   * Vérifie l’extension et met à jour le formulaire d’import.
   * @param event événement de sélection de fichier
   */
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
      input.value = '';
      this.modelImportForm.patchValue({ fichierExcel: null });
      return;
    }

    this.fileError = null;
    this.selectedFile = file;
    this.modelImportForm.patchValue({ fichierExcel: file });
    this.modelImportForm.get('fichierExcel')?.updateValueAndValidity();
  }

  /**
   * Soumet le formulaire d’import Excel.
   * Valide le formulaire, envoie le fichier et le plan au service,
   * affiche une notification et recharge la liste après réussite.
   */
  onSubmit(modal: any): void {
    console.log('--- Début import Excel ---');

    if (this.modelImportForm.invalid) {
      console.log('Formulaire invalide', this.modelImportForm.value);
      return;
    }

    if (!this.selectedFile) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('planId', this.modelImportForm.get('planId')?.value);
    formData.append('societeId', this.modelImportForm.get('societeId')?.value);

    // Log du FormData
    // console.log('Contenu FormData:');
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    this.compteService.importExcel(formData).subscribe({
      next: (res: any) => {
        this.notification.showSuccess(`Import réussi : ${res.importees} comptes importés sur ${res.totalLignes}`);
        if (res.doublons.length > 0) {
          this.notification.showError(`Lignes ignorées (doublons) : ${res.doublons.join(', ')}`);
        }
        modal.close('Close click');
        this.chargerComptesComptables();
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'import:', err);
        this.notification.showError('Échec import: ' + err);
      }
    });

  }

  /**
   * Détermine la raison de fermeture d’un modal.
   * @param reason raison de fermeture
   * @returns description de la fermeture
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Ouvre le modal de création de compte et initialise le formulaire.
   */
  openModal(): void {
    this.formVisible = true;
    this.selectedIndex = null;
    this.compteForm.reset();
    this.patchForm();
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  /**
   * Patcher le formulaire avec les id du user connecté ainsi que sa société création de compte et initialise le formulaire.
   */
  patchForm() {
      this.compteForm.patchValue({ societeId: this.societeBi.id, userId: this.userBi.id });
  }

  /**
   * Prépare l’édition d’un compte existant dans le modal.
   * @param index index du compte à édite
   */
  editCompte(index: number): void {
    this.selectedIndex = index;
    const compte = this.lignes[index];
    this.compteForm.patchValue(compte);

    this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
  }

  /**
   * Supprime un compte avec confirmation.
   * @param index index du compte à supprimer
   */
  deleteCompte(index: number): void {
    const compte = this.lignes[index];
    Swal.fire({
      title: 'Supprimer la section',
      text: `Voulez-vous vraiment supprimer le compte : "${compte.code}" ?`,
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
        this.compteService.delete(compte.id).subscribe({
          next: () => {
            this.lignes.splice(index, 1);
            this.selectedIndex = null;
            this.notification.showSuccess('Compte supprimé avec succès !');
          },
          error: (error) => this.notification.showError(error)
        });
      }
    });
  }

  /**
   * Enregistre un compte (création ou mise à jour) via le formulaire.
   */
  saveCompte(): void {
    this.closeModal();
    this.patchForm();
    this.isLoading = true;
    this.result = false;

    if (this.compteForm.invalid) {
      this.toastr.warning('Formulaire invalide');
      this.isLoading = false;
      this.result = true;
      return;
    }

    const formValue = this.compteForm.value as CompteComptableDTO;
    const action$ = formValue.id
      ? this.compteService.update(formValue.id, formValue)
      : this.compteService.create(formValue);

    action$.subscribe({
      next: () => {
        this.chargerComptesComptables();
        this.toastr.success(`Compte ${formValue.id ? 'modifié' : 'créé'} avec succès`);
        this.isLoading = false;
        this.result = true;
      },
      error: () => {
        this.toastr.error('Erreur lors de l\'enregistrement');
        this.isLoading = false;
        this.result = true;
      }
    });
  }


  /**
   * Ferme le modal
   */
  closeModal(): void {
    this.modalService.dismissAll();
  }

  /**
   * Charge la liste des comptes comptables avec pagination et filtres.
   * @param page numéro de la page (optionnel)
   */
  chargerComptesComptables(page: number = 0): void {
    this.result = false;
    this.isLoading = true;

    this.compteService.getAllCompteComptablePageable(
      page,
      this.pageSize,
      this.searchCode || undefined,
      this.searchIntitule || undefined,
      this.selectedPlan || undefined
    ).subscribe({
      next: (data: any) => {
        this.lignes = data.content;
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.result = true;
        this.isLoading = false;
        console.error('Erreur lors du chargement des plans comptables', error);
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  /**
   * Retourne un tableau de pages pour la pagination.
   * @returns tableau d’index de pages
   */
  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  /**
   * Navigue vers une page spécifique.
   * @param page numéro de la page
   */
  goToPage(page: number = 0) {
    this.chargerComptesComptables(page);
  }

  /**
   * Calcule le nombre total de pages pour la pagination.
   * @returns nombre total de pages
   */
  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  /**
   * Déclenche la recherche dès que les filtres changent.
   */
  onFilterChange(): void {
    this.search$.next({ code: this.searchCode, intitule: this.searchIntitule, plan: this.selectedPlan });
  }

  /**
   * Initialise l’écoute des changements sur les filtres avec debounce.
   */
  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(({ code, intitule, plan }) => {
          this.currentPage = 0;
          return this.compteService.getAllCompteComptablePageable(
            0,
            this.pageSize,
            code || undefined,
            intitule || undefined,
            plan || undefined
          );
        })
      )
      .subscribe({
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

}
