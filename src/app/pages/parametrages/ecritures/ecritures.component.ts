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
  selectedJournalId?: number;
  selectedCategorieId?: number;

  plansAnalytiques: any[] = [];
  analytiques: Select2Data = [];
  comptables: PlanComptable[] = [];  // Fait référence aux Plans comptables
  tiersList: any[] = [];

  comptes: CompteComptableDTO[] = [];
  listeSens = [{ id: 'CREDIT', libelle: 'CREDIT' }, { id: 'DEBIT', libelle: 'DEBIT' }];

  codeJournaux: CodeJournal[] = [];
  filteredJournaux: CodeJournal[] = [];
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];


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

  selectedIndex: number | null = null;
  ecritureForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  isTiersObligatoire = false;
  selectedCategorie: any;
  selectedTypeNature: string = '';
  showTiers = false;
  tiersRequired = false;
  isExploitation = false;
  isType = false;
  isTresorerie = false;
  showSectionAnalytique = false;
  showTVA = false;
  showTTC = false;
  prefixe: string;
  lastTypeId: any;
  tiersObligatoire: boolean;
  societeBi: any;

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
    this.ecritureForm = this.fb.group({
      id: [],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      compteComptableId: ['', Validators.required],
      codeJournalId: [null, Validators.required],
      categorieId: [null, Validators.required],
      societeId: [null, Validators.required],
      typeNature: [null],
      sectionAnalytiqueId: [null],
      tiersId: [null],
      montantHt: [0, Validators.required],
      tva: [0],
      montantTtc: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Vos écritures", path: '/', active: true }];
    this.chargerNatureOperationDtos();
    this.chargerCategories();
    this.chargerPlansAnalytiques();
    this.chargerCodesJournaux();
    this.chargerSectionsAnalytiques();
    this.chargerComptesComptables();
    this.chargerTiers();
    this.initSearchListener();
    const societeActiveStr = localStorage.getItem("societeActive");
    if (societeActiveStr) {
      this.societeBi = JSON.parse(societeActiveStr);
      // Patch des valeurs dans les formulaires
      this.ecritureForm.patchValue({ societeId: this.societeBi.id });
    }
    this.ecritureForm.get('montantHt')?.valueChanges.subscribe(() => this.calculerMontantTtc());
    this.ecritureForm.get('tva')?.valueChanges.subscribe(() => this.calculerMontantTtc());
  }

  calculerMontantTtc() {
    const ht = Number(this.ecritureForm.get('montantHt')?.value) || 0;
    const tva = Number(this.ecritureForm.get('tva')?.value) || 0;
    const ttc = ht + (ht * tva / 100);
    this.ecritureForm.patchValue({ montantTtc: ttc }, { emitEvent: false });
  }

  onJournalChange(journalId: number) {
    this.selectedJournalId = journalId;

    const journal = this.codeJournaux.find((j: { id: number; }) => j.id === journalId);
    console.log(journal);
    if (journal?.allowedCategoryTypes?.length) {
      this.filteredCategories = this.categories.filter(cat =>
        journal.allowedCategoryTypes?.includes(cat.type)
      );
    } else {
      this.filteredCategories = [...this.categories];
    }

    // Si une catégorie est déjà sélectionnée, vérifier qu'elle est toujours valide
    if (this.selectedCategorieId && !this.filteredCategories.some(c => c.id === this.selectedCategorieId)) {
      this.selectedCategorieId = undefined;
      this.ecritureForm.patchValue({ categorieId: null });
    }
  }

  onCategorieChange(categorieId: number | null) {
    if (!categorieId) {
      this.resetCategorieSelection();
      return;
    }

    const categorie = this.categories.find(c => c.id === categorieId);
    this.selectedCategorie = categorie;

    if (!categorie) {
      this.resetCategorieSelection();
      return;
    }

    this.selectedTypeNature = categorie.type;
    this.loadComptesForCategorie(categorie);
    this.filterJournauxForCategorie(categorie);
    this.applyCategorieRules(categorie);
    this.checkSelectedJournal();
  }

  private resetCategorieSelection() {
    this.selectedCategorie = null;
    this.selectedTypeNature = " ";
    this.comptes = [];
    this.showTVA = false;
    this.showTTC = false;
    this.showSectionAnalytique = false;
    this.showTiers = false;
    this.isTiersObligatoire = false;

    this.ecritureForm.patchValue({
      categorieId: null,
      compteComptableId: null,
      tva: 0,
      montantTtc: 0,
      tiersId: null,
      sectionAnalytiqueId: null
    });

    this.resetCategorieRules();
  }

  private loadComptesForCategorie(categorie: Categorie) {
    this.comptes = categorie.compteComptableIds.map((id, i) => ({
      id,
      code: categorie.compteComptableCodes[i],
      intitule: categorie.compteComptableIntitules[i],
      planComptableId: 0,
      classeCompte: ''
    })) as CompteComptableDTO[];

    this.ecritureForm.patchValue({
      compteComptableId: this.comptes.length > 0 ? this.comptes[0].id : null
    });
  }

  private filterJournauxForCategorie(categorie: Categorie) {
    this.filteredJournaux = this.codeJournaux.filter(j =>
      !j.allowedCategoryTypes?.length || j.allowedCategoryTypes.includes(categorie.type)
    );
  }

  private applyCategorieRules(categorie: Categorie) {
    this.showSectionAnalytique = ['RECETTE', 'DEPENSE'].includes(categorie.type);
    this.showTVA = this.showSectionAnalytique;
    this.showTTC = this.showSectionAnalytique;

    if (!this.showTVA) {
      this.ecritureForm.patchValue({
        tva: 0,
        montantTtc: this.ecritureForm.value.montantHt
      });
    }

    if (['RECETTE', 'DEPENSE', 'SALAIRE'].includes(categorie.type)) {
      this.showTiers = true;
      this.isTiersObligatoire = true;
      this.ecritureForm.get('tiersId')?.setValidators([Validators.required]);
    } else if (['IMMOBILISATION', 'TRESORERIE', 'TRANSFERT'].includes(categorie.type)) {
      this.showTiers = true;
      this.isTiersObligatoire = false;
      this.ecritureForm.get('tiersId')?.clearValidators();
    } else {
      this.resetCategorieRules();
    }
  }

  private checkSelectedJournal() {
    if (this.selectedJournalId && !this.filteredJournaux.some(j => j.id === this.selectedJournalId)) {
      this.selectedJournalId = undefined;
      this.ecritureForm.patchValue({ codeJournalId: null });
    }

    this.ecritureForm.get('tiersId')?.updateValueAndValidity();
  }

  resetCategorieRules(): void {
    this.showSectionAnalytique = false;
    this.showTiers = false;
    this.isTiersObligatoire = false;
    this.ecritureForm.patchValue({ sectionAnalytiqueId: null, tiersId: null });
    this.ecritureForm.get('tiersId')?.clearValidators();
    this.ecritureForm.get('tiersId')?.updateValueAndValidity();
  }

  searchFn(term: string, item: any) {
    if (!term) return true;
    term = term.toLowerCase();
    return item.intitule?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);
  }

  ajouter(): void {
    this.ecritureForm.patchValue({
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

  // supprimer(): void {
  //   if (this.selectedIndex !== null) {
  //     const currentData = this.lignes[this.selectedIndex] as NatureOperationDto;
  //     this.ecritureForm.setValue(currentData);
  //     this.lignes.splice(this.selectedIndex, 1);
  //     this.selectedIndex = null;
  //     this.deleteNatureOperationDto(currentData);
  //   }
  //   const cabinet = this.lignes[this.selectedIndex].value;
  //   this.deleteCabinet(cabinet);
  // }

  edit(nature: NatureOperationDto): void {
    this.selected = { ...nature };
    this.ecritureForm.patchValue(this.selected);
    this.formVisible = true;
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
  }

  enregistrer(): void {
    this.closeModal();
    this.isLoading = true;
    this.result = false;

    if (this.ecritureForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const natureOperation = this.ecritureForm.value as NatureOperationDto;
    console.log(natureOperation);
    const action$ = natureOperation?.id
      ? this.natureOperationService.update(natureOperation.id, natureOperation)
      : this.natureOperationService.create(natureOperation);

    action$.subscribe({
      next: () => {
        this.chargerNatureOperationDtos();
        const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.loading = false;
        this.result = true;
        this.selectedIndex = null;
        this.selected = undefined;
      },
      error: () => {
        this.loading = false;
        this.result = true;
        this.notification.showError('Erreur serveur !!!');
      }
    });
  }

  chargerNatureOperationDtos(): void {
    this.isLoading = true;
    this.result = false;
    this.natureOperations = [];

    this.natureOperationService.getAll().subscribe({
      next: (data: NatureOperationDto[]) => {
        // On suppose que le backend renvoie déjà un tableau plat prêt à l'affichage
        this.natureOperations = data;
        console.log(this.natureOperations);

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

  chargerCodesJournaux() {
    this.natureOperationService.getAllCodeJournal().subscribe(
      {
        next: (data: any) => {
          this.codeJournaux = data;
          this.filteredJournaux = [...this.codeJournaux];
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
      next: (data: any[]) => {
        this.categories = data;
        this.filteredCategories = [...this.categories];
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log('Erreur lors du chargement des categories', error);
        this.notification.showError("Erreur lors du chargement des catégories");
      }
    });
  }

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

  deleteNatureOperationDto(index: number): void {
    const nature = this.lignes[index];

    Swal.fire({
      title: "Supprimer l'écriture",
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
    this.ecritureForm.patchValue({ societeId: 1 });
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
    this.formVisible = false;
  }

  editNature(index: number): void {
    this.selectedIndex = index;
    const nature = this.lignes[index];
    this.selected = nature;
    this.ecritureForm.patchValue(nature);
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