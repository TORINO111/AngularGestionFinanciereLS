import { PlanAnalytiqueDTO } from '../../../models/plan-analytique.model';
import { PlansAnalytiquesService } from '../../../services/plans-analytiques/plans-analytiques.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NatureOperationService } from 'src/app/services/nature-operation/nature-operation.service';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import Swal from 'sweetalert2';
import { Select2Data } from 'ng-select2-component';
import { CodeJournal } from 'src/app/models/code-journal.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';
import { SectionAnalytique } from 'src/app/models/section-analytique';
import { SectionAnalytiqueService } from 'src/app/services/section-analytique/section-analytique.service';
import { Categorie } from 'src/app/models/categorie.model';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { PlanComptable } from 'src/app/models/plan-comptable.model';
import { NatureOperationDto } from 'src/app/models/nature-operation.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { TiersService } from 'src/app/services/tiers/tiers.service';

@Component({
  selector: 'app-nature-operations',
  templateUrl: './ecritures.component.html',
  styleUrls: ['./ecritures.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class EcrituresComponent implements OnInit {

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  @ViewChild('searchCodeChamp', { static: true }) searchCodeChamp!: ElementRef<HTMLInputElement>;
  @ViewChild('searchCategorie', { static: true }) searchCategorie!: ElementRef<HTMLInputElement>;
  @ViewChild('searchJournal', { static: true }) searchJournal!: ElementRef<HTMLInputElement>;


  selected?: NatureOperationDto | null;

  natureOperations: any[] = [];
  lignes: any[] = [];

  totalElements: number = 0;
  pageSize: number = 40;
  currentPage: number = 0;
  private search$ = new Subject<{ code: string, categorie: number, journal: number }>();
  searchCate: number;
  searchCode: string = '';
  selectedJournal: number;

  plansAnalytiques: any[] = [];
  analytiques: Select2Data = [];
  comptables: PlanComptable[] = [];  // Fait référence aux Plans comptables
  categories: any[] = [];
  tiersList: any[] = [];
  
  comptes: CompteComptableDTO[] = [];
  listeSens = [{ id: 'CREDIT', libelle: 'CREDIT' }, { id: 'DEBIT', libelle: 'DEBIT' }];
  codesjournaux: CodeJournal[] = [];

  typeNatures = [
    { label: 'Dépense', value: 'DEPENSE' },
    { label: 'Exploitation', value: 'EXPLOITATION' },
    { label: 'Immobilisation', value: 'IMMOBILISATION' },
    { label: 'Recette', value: 'RECETTE' },
    { label: 'Salaire', value: 'SALAIRE' },
    { label: 'Encaissement', value: 'ENCAISSEMENT' },
    { label: 'Décaissement', value: 'DECAISSEMENT' },
    { label: 'Capitaux propres', value: 'CAPITAUX_PROPRES' }
  ];

  sectionsAnalytiques: SectionAnalytique[] = [];
  types: any[] = [];

  selectedTypeNature = '';

  selectedIndex: number | null = null;
  natureOperationForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  showTiers = false;
  tiersRequired = false;
  isExploitation = false;
  isType = false;
  isTresorerie = false;
  prefixe: string;
  selectedCategorie: any;
  lastTypeId: any;
  tiersObligatoire: boolean;

  constructor(
    private natureOperationService: NatureOperationService,
    private categorieService: CategorieService,
    private planComptableService: PlanComptableService,
    private compteComptableService: CompteComptableService,
    private planAnalytiqueService: PlansAnalytiquesService,
    private fb: UntypedFormBuilder,
    private notification: NotificationService,
    private sectionAnalytiqueService: SectionAnalytiqueService,
    private tiersService: TiersService,
    private modalService: NgbModal
  ) {
    this.natureOperationForm = this.fb.group({
      id: [],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      compteComptableId: ['', Validators.required],
      codeJournalId: [null, Validators.required],
      categorieId: [null, Validators.required],
      societeId: [null, Validators.required],
      typeNature: [null],
      sectionAnalytiqueId: [null],  // optionnel selon catégorie
      tiersId: [null],               // obligatoire/facultatif selon catégorie
      montant: ['', Validators.required],   // montant HT
      tva: [''],                            // TVA
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Vos écritures", path: '/', active: true }];
    this.chargerNatureOperationDtos();
    this.chargerCategories();
    this.chargerPlansAnalytiques();
    this.chargerCodeJournal();
    this.chargerSectionsAnalytiques();
    this.chargerComptesComptables();
    this.chargerTiers();
    this.initSearchListener()
  }

  onCategorieChange(): void {
    const selectedId = this.natureOperationForm.get('categorieId')?.value;
    if (!selectedId) return;

    this.selectedCategorie = this.categories.find(c => c.id === +selectedId);
    if (!this.selectedCategorie) return;

    const type = this.selectedCategorie.type || '';
    this.selectedTypeNature = type;

    // Compte comptable lié à la catégorie
    this.natureOperationForm.patchValue({
      compteComptableId: this.selectedCategorie.compteComptableId || null
    });

    // Section analytique optionnelle pour RECETTE ou DEPENSE
    this.isExploitation = ['RECETTE', 'DEPENSE'].includes(type);
    if (!this.isExploitation) this.natureOperationForm.patchValue({ sectionAnalytiqueId: null });

    // Tiers obligatoire ou facultatif
    this.tiersObligatoire = ['RECETTE', 'DEPENSE', 'SALAIRE'].includes(type);

    this.chargerComptables(type);
  }

  ajouter(): void {
    this.natureOperationForm.reset();
    this.natureOperationForm.patchValue({
      societeId: 1
    });
    this.formVisible = true;
    this.selectedIndex = null;
    this.selected = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      this.formVisible = true;
    }
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as NatureOperationDto;
      this.natureOperationForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteNatureOperationDto(currentData);
    }
  }

  edit(nature: NatureOperationDto): void {
    this.selected = { ...nature };
    this.natureOperationForm.patchValue(this.selected);
    this.formVisible = true;
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.natureOperationForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as NatureOperationDto;
    this.selected = currentData;

    this.natureOperationForm.patchValue({
      ...currentData,
      categorieId: currentData.categorieId
    });

    // Chargement des comptes selon typeNature
    console.log(currentData.typeNature);
    this.chargerComptables(currentData.typeNature);
  }

  enregistrer(): void {
    //   console.log(this.natureOperationForm.value)
    //  return;
    if (this.natureOperationForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const natureOperation = this.natureOperationForm.value as NatureOperationDto;

    const action$ = this.selected?.id
      ? this.natureOperationService.update(this.selected.id, natureOperation)
      : this.natureOperationService.create(natureOperation);

    action$.subscribe({
      next: () => {
        const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.natureOperationForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerNatureOperationDtos();
      },
      error: () => {
        this.loading = false;
        this.notification.showError('Erreur serveur !!!');
      }
    });
  }

  chargerNatureOperationDtos(): void {
    this.natureOperations = [];
    this.natureOperationService.getAll().subscribe({
      next: (data: NatureOperationDto[]) => {
        this.natureOperations = data.map(d =>
          this.fb.group({
            id: [d.id],
            code: [d.code],
            libelle: [d.libelle],

            // Relations pour création/modification
            compteComptableId: [d.compteComptableId],
            compteContrePartieId: [d.compteContrePartieId],
            sectionAnalytiqueId: [d.sectionAnalytiqueId],
            categorieId: [d.categorieId],
            codeJournalId: [d.codeJournalId],
            societeId: [d.societeId],

            // Relations pour affichage lisible
            compteComptableLibelle: [d.compteComptableLibelle],
            compteContrePartieLibelle: [d.compteContrePartieLibelle],
            sectionAnalytiqueLibelle: [d.sectionAnalytiqueLibelle],
            categorieLibelle: [d.categorieLibelle],
            categorieType: [d.categorieType],
            codeJournal: [d.codeJournal],
            libelleJournal: [d.libelleJournal],
            societeLibelle: [d.societeLibelle],

            typeNature: [d.typeNature],
            sensParDefaut: [d.sensParDefaut],
            sensLibelle: [d.sensLibelle]
          })
        );
        this.lignes = this.natureOperations;
        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des natures opérations', error);
        this.result = true;
        this.isLoading = false;
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  chargerCodeJournal() {
    this.natureOperationService.getAllCodeJournal().subscribe(
      {
        next: (data: any) => {
          this.codesjournaux = data;
          this.result = true;
        },
        error: (error: any) => {
          this.result = true;
          console.log('Erreur lors du chargement des codes journaux', error);
          this.notification.showError("erreur lors du chargement des codes journaux");
        }
      }
    );
  }

   chargerTiers() {
    this.tiersService.getAll().subscribe(
      {
        next: (data: any) => {
          this.tiersList = data;
          this.result = true;
        },
        error: (error: any) => {
          this.result = true;
          console.log('Erreur lors du chargement des tiers', error);
          this.notification.showError("erreur lors du chargement des tiers");
        }
      }
    );
  }

  chargerCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data.map(d => ({
          id: d.id,
          code: d.code,
          libelle: d.libelle,
          type: d.type
        }));
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log('Erreur lors du chargement des categories', error);
        this.notification.showError("Erreur lors du chargement des catégories");
      }
    });
  }

  // chargerNatureOperations() {
  //   this.natureOperationService.getAll().subscribe({
  //     next: (data: CompteComptableDTO[]) => {
  //       this.comptes = data.map(d => ({
  //         id: d.id,
  //         code: d.code,
  //         intitule: d.intitule
  //       }));
  //       this.result = true;
  //     },
  //     error: (error: any) => {
  //       this.result = true;
  //       console.log('Erreur lors du chargement des categories', error);
  //       this.notification.showError("Erreur lors du chargement des catégories");
  //     }
  //   });
  // }

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

  chargerComptables(typeNature: string) {
    this.planComptableService.getByTypeNature(typeNature).subscribe({
      next: (data: PlanComptable[]) => this.comptables = data,
      error: (err: any) => this.notification.showError(err)
    });
  }

  chargerPlansAnalytiques() {
    this.planAnalytiqueService.getAllPlanAnalytique().subscribe({
      next: (data: PlanAnalytiqueDTO[]) => {
        this.plansAnalytiques = data.map(d =>
          this.fb.group({
            id: [d.id],
            intitule: [d.intitule],
          })
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tiers', err);
        this.notification.showError("Erreur..");
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

  deleteNatureOperationDto(nature: NatureOperationDto): void {
    Swal.fire({
      title: 'Supprimer la Nature Opération',
      html: `
        <p><strong>Nature : </strong><span style="color: #009879; font-size: 1.2em;">${nature.libelle}</span></p>
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
        this.natureOperationService.delete(nature.id!).subscribe({
          next: () => {
            this.natureOperations = [];
            this.chargerNatureOperationDtos();
            Swal.fire('Succès', 'Nature supprimée avec succès.', 'success');
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

  openModal(): void {
    this.formVisible = true;
    this.selectedIndex = null;
    this.natureOperationForm.reset();
    this.natureOperationForm.patchValue({ societeId: 1 });
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.natureOperationForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }

  editNature(index: number): void {
    this.selectedIndex = index;
    const nature = this.natureOperations[index].value;
    this.natureOperationForm.patchValue(nature);
    this.formVisible = true;
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  deleteNature(index: number): void {
    const nature = this.natureOperations[index].value;
    this.deleteNatureOperationDto(nature);
  }

  chargerNaturesOperations(page: number = 0): void {
    this.currentPage = page;

    this.natureOperationService.getAllPageable(page,
      this.pageSize,
      this.searchCode ? this.searchCode : undefined,
      this.searchCate ? this.searchCate : undefined,
      this.selectedJournal ? this.selectedJournal : undefined,
    ).subscribe({
      next: (data: any) => {
        this.lignes = data.content;
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
    this.chargerNaturesOperations(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  onFilterChange(): void {
    this.search$.next({ code: this.searchCode, categorie: this.searchCate, journal: this.selectedJournal });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ code, categorie, journal }) => {
          this.currentPage = 0;
          return this.natureOperationService.getAllPageable(
            0,
            this.pageSize,
            code || undefined,
            categorie || undefined,
            journal || undefined,
          );
        })
      )
      .subscribe({
        next: data => {
          this.lignes = data.content;
          this.currentPage = 0;
        },
        error: err => console.error('Erreur lors de la recherche', err)
      });
  }

}