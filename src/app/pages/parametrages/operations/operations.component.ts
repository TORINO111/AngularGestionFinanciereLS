import { PlanAnalytiqueDTO } from "../../../models/plan-analytique.model";
import { PlansAnalytiquesService } from "../../../services/plans-analytiques/plans-analytiques.service";
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NatureOperationService } from "src/app/services/operations/operations.service";
import { CategorieService } from "src/app/services/categories/categorie.service";
import { PlanComptableService } from "src/app/services/plan-comptable/plan-comptable.service";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import Swal from "sweetalert2";
import { Select2Data } from "ng-select2-component";
import { CodeJournal } from "src/app/models/code-journal.model";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import { SectionAnalytique } from "src/app/models/section-analytique";
import { SectionAnalytiqueService } from "src/app/services/section-analytique/section-analytique.service";
import { Categorie } from "src/app/models/categorie.model";
import { CompteComptableService } from "src/app/services/comptes-comptables/comptes-comptables.service";
import { CompteComptableDTO } from "src/app/models/compte-comptable";
import { PlanComptable } from "src/app/models/plan-comptable.model";
import { OperationDto } from "src/app/models/operation.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, Subject, switchMap, tap } from "rxjs";
import { TiersService } from "src/app/services/tiers/tiers.service";
import { ArticlesService } from "src/app/services/articles/articles.service";
import { ArticleDTO } from "src/app/models/article.model";
import { ControlesFormulairesService } from "src/app/services/composite/controles-formulaires/controles-formulaires.service";
import { SocieteService } from "src/app/services/societe/societe.service";

@Component({
  selector: "app-nature-operations",
  templateUrl: "./operations.component.html",
  styleUrls: ["./operations.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class OperationsComponent implements OnInit {
  @ViewChild("modalContent") modalContent!: TemplateRef<any>;
  @ViewChild("DetailModalContent") detailModalContent!: TemplateRef<any>;

  @ViewChild("searchCodeChamp", { static: true })
  searchCodeChamp!: ElementRef<HTMLInputElement>;
  @ViewChild("searchCategorie", { static: true })
  searchCategorie!: ElementRef<HTMLInputElement>;
  @ViewChild("searchJournal", { static: true })
  searchJournal!: ElementRef<HTMLInputElement>;

  selected?: OperationDto | null;

  natureOperations: any[] = [];
  lignes: any[] = [];

  totalElements: number = 0;
  pageSize: number = 40;
  currentPage: number = 0;

  private search$ = new Subject<{
    libelle?: string;
    journalId?: number;
    categorieId?: number;
    tiersId?: number;
    societeId?: number;
  }>();

  searchTerm: string = "";
  selectedJournalId?: number;
  selectedCategorieId?: number;
  selectedArticleId: number | null;
  selectedTiersId?: number;
  selectedSocieteId?: number;

  searchCate: number;
  searchCode: string = "";
  selectedJournal: number;

  plansAnalytiques: any[] = [];
  analytiques: Select2Data = [];
  comptables: PlanComptable[] = []; // Fait référence aux Plans comptables
  tiersList: any[] = [];
  societes: any[] = [];

  comptes: CompteComptableDTO[] = [];
  listeSens = [
    { id: "CREDIT", libelle: "CREDIT" },
    { id: "DEBIT", libelle: "DEBIT" },
  ];

  mouvements = [
    { id: "ACHAT", libelle: "Achat" },
    { id: "VENTE", libelle: "Vente" },
  ];

  journaux: any[] = [];
  filteredJournaux: CodeJournal[] = [];

  typeNatures = [
    { label: "Dépense", value: "DEPENSE" },
    { label: "Exploitation", value: "EXPLOITATION" },
    { label: "Immobilisation", value: "IMMOBILISATION" },
    { label: "Recette", value: "RECETTE" },
    { label: "Salaire", value: "SALAIRE" },
    { label: "Encaissement", value: "ENCAISSEMENT" },
    { label: "Décaissement", value: "DECAISSEMENT" },
    { label: "Capitaux propres", value: "CAPITAUX_PROPRES" },
  ];

  sectionsAnalytiques: SectionAnalytique[] = [];
  types: any[] = [];

  selectedIndex: number | null = null;
  operationForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;

  isTiersObligatoire = false;
  selectedCategorie: any;
  selectedTypeNature: string = "";
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
  userBi: any;
  exerciceBi: any;
  articles: any[];
  selectedArticle: any;
  filteredArticles: Categorie[];
  selectedCompte: any;

  isAdminNumexis: boolean = false;
  isAdminEntreprise: boolean = false;

  constructor(
    private natureOperationService: NatureOperationService,
    private articleService: ArticlesService,
    private planComptableService: PlanComptableService,
    private compteComptableService: CompteComptableService,
    private planAnalytiqueService: PlansAnalytiquesService,
    private fb: UntypedFormBuilder,
    private notification: NotificationService,
    private sectionAnalytiqueService: SectionAnalytiqueService,
    private tiersService: TiersService,
    public controleForm: ControlesFormulairesService,
    private modalService: NgbModal,
    private societeService: SocieteService
  ) {
    this.operationForm = this.fb.group({
      id: [],
      libelle: [null, [Validators.required, Validators.minLength(2)]],
      compteComptableId: [null, Validators.required],
      codeJournalId: [null, Validators.required],
      articleId: [{ value: null, disabled: true }, Validators.required],
      mouvement: [{ value: null, disabled: true }, Validators.required],
      societeId: [null],
      userId: [null],
      exerciceId: [null],
      typeNature: [null],
      sectionAnalytiqueId: [null],
      tiersId: [null],
      quantite: [0, Validators.required],
      montantHt: [0, Validators.required],
      tva: [0],
      montantTtc: [{ value: 0, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Vos opérations", path: "/", active: true }];

    const societeActiveStr = localStorage.getItem("societeActive");
    const userActive = localStorage.getItem("user");
    const exerciceActive = localStorage.getItem("exerciceEnCours");

    if (userActive) {
      this.userBi = JSON.parse(userActive);
      if (this.userBi.role === "ADMIN") {
        this.isAdminNumexis = true;
        this.chargerSocietes();
      } else if (this.userBi.role === "ENTREPRISE_ADMIN") {
        this.isAdminEntreprise = true;
      }
    }
    if (societeActiveStr && exerciceActive) {
      this.societeBi = JSON.parse(societeActiveStr);
      this.exerciceBi = JSON.parse(exerciceActive);
    }
    this.chargerOperationPageable();

    this.chargerArticles();
    this.chargerPlansAnalytiques();
    this.chargerJournaux();
    this.chargerSectionsAnalytiques();
    this.chargerComptesComptables();
    this.chargerTiers();
    this.initSearchListener();

    this.operationForm
      .get("quantite")
      ?.valueChanges.subscribe(() => this.calculerMontantTtc());
    this.operationForm
      .get("articleId")
      ?.valueChanges.subscribe(() => this.calculerMontantTtc());

    this.operationForm
      .get("montantHt")
      ?.valueChanges.subscribe(() => this.calculerMontantTtc());
    this.operationForm
      .get("tva")
      ?.valueChanges.subscribe(() => this.calculerMontantTtc());
  }

  // calculerMontantTtc() {
  //   const ht = Number(this.operationForm.get('montantHt')?.value) || 0;
  //   const tva = Number(this.operationForm.get('tva')?.value) || 0;
  //   const ttc = ht + (ht * tva / 100);
  //   this.operationForm.patchValue({ montantTtc: ttc }, { emitEvent: false });
  // }

  calculerMontantTtc() {
    const article = this.selectedArticle;
    const quantite = Number(this.operationForm.get("quantite")?.value) || 0;
    const tva = Number(this.operationForm.get("tva")?.value) || 0;

    const montantHt = article ? quantite * article.prixUnitaire : 0;

    const montantTtc = montantHt + (montantHt * tva) / 100;

    this.operationForm.patchValue(
      { montantHt, montantTtc },
      { emitEvent: false } // pour éviter une boucle infinie
    );
  }

  onJournalChange(journalId: number) {
    this.selectedJournalId = journalId;

    if (journalId != null) {
      const journal = this.journaux.find((j) => j.id === journalId);
      console.log(journal);

      if (journal?.allowedCategoryTypes?.length) {
        this.filteredArticles = this.articles.filter((article) =>
          article.comptesParCategorie?.some((c: { typeCategorie: string }) =>
            journal.allowedCategoryTypes?.includes(c.typeCategorie)
          )
        );
      } else {
        // Aucun filtre spécifique : on garde tous les articles
        this.filteredArticles = [...this.articles];
      }

      // Reset de l'article sélectionné à chaque changement de journal
      this.selectedArticleId = null;
      this.selectedArticle = null;
      this.operationForm.patchValue({ articleId: null });

      // Activer le champ article
      this.operationForm.get("mouvement")?.enable();
      this.operationForm.get("articleId")?.enable();
    } else {
      // Aucun journal sélectionné : désactiver le champ article
      this.filteredArticles = [];
      this.selectedArticleId = null;
      this.selectedArticle = null;
      this.operationForm.patchValue({ articleId: null });
      this.operationForm.get("articleId")?.disable();
      this.operationForm.get("mouvement")?.disable();
    }
  }

  onArticleChange(articleId: number | null) {
    if (!articleId) {
      this.resetArticleSelection();
      return;
    }

    const article = this.articles.find((a) => a.id === articleId);
    if (!article) {
      this.resetArticleSelection();
      return;
    }

    this.selectedArticle = article;

    const mouvement = this.operationForm.get("mouvement")?.value;
    let comptesFiltres = article.comptesParCategorie ?? [];

    // 🔍 Si un mouvement est sélectionné, on ne garde que les comptes correspondants
    if (mouvement) {
      comptesFiltres = comptesFiltres.filter(
        (c: { typeMouvement: any }) => c.typeMouvement === mouvement
      );
    }

    // S’il n’y a aucun compte pour ce mouvement => reset
    if (!comptesFiltres.length) {
      this.notification.showWarning(
        `Aucun compte associé à cet article pour le mouvement "${mouvement}".`
      );
      this.resetArticleSelection();
      return;
    }

    // 🧠 On continue avec les comptes filtrés
    this.loadComptesForArticle({
      ...article,
      comptesParCategorie: comptesFiltres,
    });
    this.filterJournauxForArticle(article);
    this.applyArticleRules({
      typesCategorie: comptesFiltres.map(
        (c: { typeCategorie: any }) => c.typeCategorie
      ),
      typesMouvement: comptesFiltres.map(
        (c: { typeMouvement: any }) => c.typeMouvement
      ),
    });

    // Récupérer le compte comptable selon le journal sélectionné
    if (this.selectedJournalId) {
      const journal = this.journaux.find(
        (j) => j.id === this.selectedJournalId
      );

      if (journal?.allowedCategoryTypes?.length) {
        const matchedCompte = comptesFiltres.find((c: { typeCategorie: any }) =>
          journal.allowedCategoryTypes.includes(c.typeCategorie)
        );

        if (matchedCompte) {
          this.operationForm.patchValue({
            compteComptableId: matchedCompte.compteId,
          });
          this.selectedCompte = matchedCompte;
        } else {
          this.selectedCompte = null;
        }
      }
    }

    this.assignerValidatorsQuantiteArticle();
  }

  onMouvementChange() {
    this.assignerValidatorsQuantiteArticle();

    const articleId = this.operationForm.get("articleId")?.value;
    if (articleId) {
      this.onArticleChange(articleId);
    }
  }

  assignerValidatorsQuantiteArticle() {
    const quantiteControl = this.operationForm.get("quantite");

    quantiteControl?.setValidators([
      Validators.required,
      this.controleForm.quantiteMaxValidator(
        () => this.selectedArticle?.quantite ?? 0,
        () => this.operationForm.get("mouvement")?.value ?? ""
      ),
    ]);

    quantiteControl?.updateValueAndValidity();
  }

  private resetArticleSelection() {
    this.selectedArticle = null;
    this.selectedTypeNature = " ";
    this.comptes = [];
    this.showTVA = false;
    this.showTTC = false;
    this.showSectionAnalytique = false;
    this.showTiers = false;
    this.isTiersObligatoire = false;

    this.operationForm.patchValue({
      articleId: null,
      compteComptableId: null,
      tva: 0,
      montantTtc: 0,
      tiersId: null,
      sectionAnalytiqueId: null,
    });

    this.resetArticleRules();
  }

  private loadComptesForArticle(article: ArticleDTO): void {
    if (!article || !article.comptesParCategorie?.length) {
      this.resetArticleRules();
      return;
    }

    const comptes = article.comptesParCategorie;
    const typesCategorie = comptes.map((c) => c.typeCategorie);
    const typesMouvement = comptes.map((c) => c.typeMouvement);

    // Application des règles analytiques et tiers
    this.applyArticleRules({ typesCategorie, typesMouvement });
  }

  private filterJournauxForArticle(article: ArticleDTO): void {
    if (!article?.comptesParCategorie?.length) {
      this.filteredJournaux = this.journaux;
      return;
    }

    // Extraire tous les types de catégories associés à l'article
    const articleTypes = article.comptesParCategorie.map(
      (c) => c.typeCategorie
    );

    // Filtrer les journaux compatibles
    this.filteredJournaux = this.journaux.filter(
      (journal) =>
        !journal.allowedCategoryTypes?.length ||
        journal.allowedCategoryTypes.some((t: string) =>
          articleTypes.includes(t)
        )
    );
  }

  private applyArticleRules(data: {
    typesCategorie: string[];
    typesMouvement: string[];
  }) {
    const ANALYTICAL_TYPES = ["RECETTE", "DEPENSE"];
    const TIERS_REQUIRED_TYPES = ["RECETTE", "DEPENSE", "SALAIRE"];
    const TIERS_OPTIONAL_TYPES = ["IMMOBILISATION", "TRESORERIE", "TRANSFERT"];

    const { typesCategorie } = data;

    this.updateAnalyticalSections(typesCategorie, ANALYTICAL_TYPES);
    this.updateTiersRules(
      typesCategorie,
      TIERS_REQUIRED_TYPES,
      TIERS_OPTIONAL_TYPES
    );
  }

  private updateAnalyticalSections(types: string[], analyticalTypes: string[]) {
    const showAnalytical = types.some((t) => analyticalTypes.includes(t));

    this.showSectionAnalytique = showAnalytical;
    this.showTVA = showAnalytical;
    this.showTTC = showAnalytical;

    if (!showAnalytical) {
      this.operationForm.patchValue(
        {
          tva: 0,
          montantTtc: this.operationForm.value.montantHt,
        },
        { emitEvent: false }
      );
    }
  }

  private updateTiersRules(
    types: string[],
    requiredTypes: string[],
    optionalTypes: string[]
  ) {
    const tiersControl = this.operationForm.get("tiersId");

    if (types.some((t) => requiredTypes.includes(t))) {
      this.configureTiers(true, tiersControl);
    } else if (types.some((t) => optionalTypes.includes(t))) {
      this.configureTiers(false, tiersControl);
    } else {
      this.resetArticleRules();
    }
  }

  private configureTiers(isRequired: boolean, control: AbstractControl | null) {
    this.showTiers = true;
    this.isTiersObligatoire = isRequired;

    if (isRequired) control?.setValidators([Validators.required]);
    else control?.clearValidators();

    control?.updateValueAndValidity();
  }

  private checkSelectedJournal() {
    if (
      this.selectedJournalId &&
      !this.filteredJournaux.some((j) => j.id === this.selectedJournalId)
    ) {
      this.selectedJournalId = undefined;
      this.operationForm.patchValue({ codeJournalId: null });
    }

    this.operationForm.get("tiersId")?.updateValueAndValidity();
  }

  resetArticleRules(): void {
    this.showSectionAnalytique = false;
    this.showTiers = false;
    this.isTiersObligatoire = false;
    this.operationForm.patchValue({ sectionAnalytiqueId: null, tiersId: null });
    this.operationForm.get("tiersId")?.clearValidators();
    this.operationForm.get("tiersId")?.updateValueAndValidity();
  }

  searchFn(term: string, item: any) {
    if (!term) return true;
    term = term.toLowerCase();
    return (
      item.intitule?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term)
    );
  }

  ajouter(): void {
    this.operationForm.patchValue({
      societeId: 1,
    });
    this.selectedIndex = null;
    this.selected = null;
  }

  edit(nature: OperationDto): void {
    this.selected = { ...nature };
    this.operationForm.patchValue(this.selected);
  }

  fermer(): void {
    this.selectedIndex = null;
  }

  enregistrer(): void {
    this.closeModal();
    this.isLoading = true;
    this.result = false;

    if (this.operationForm.invalid) {
      this.notification.showWarning("Formulaire invalide");
      return;
    }

    const natureOperation = this.operationForm.value;
    console.log(natureOperation);
    const action$ = natureOperation?.id
      ? this.natureOperationService.update(natureOperation.id, natureOperation)
      : this.natureOperationService.create(natureOperation);

    action$.subscribe({
      next: () => {
        this.chargerOperationPageable();
        const msg = this.selected?.id ? "Modifié" : "Enregistré";
        this.notification.showSuccess(`${msg} avec succès`);
        this.loading = false;
        this.result = true;
        this.selectedIndex = null;
        this.selected = undefined;
      },
      error: () => {
        this.loading = false;
        this.result = true;
        this.notification.showError("Erreur serveur !!!");
      },
    });
  }

  chargerOperationPageable(page: number = 0): void {
    this.isLoading = true;
    this.result = false;

    this.currentPage = page;

    this.natureOperationService
      .getByFilters(
        page,
        this.pageSize,
        this.selectedJournalId,
        this.selectedCategorieId,
        this.selectedTiersId,
        this.searchTerm,
        this.selectedSocieteId
      )
      .subscribe({
        next: (data) => {
          this.natureOperations = data.content;
          this.lignes = [...this.natureOperations];
          this.totalElements = data.totalElements;
          this.result = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur lors du chargement des écritures", err);
          this.result = true;
          this.isLoading = false;
        },
      });
  }

  chargerSocietes() {
    this.societeService.getAllSociete().subscribe({
      next: (data) => {
        this.societes = data;
      },
      error: (err) => {
        this.notification.showError("Erreur lors du chargement des sociétés.");
        console.error(err);
      },
    });
  }

  chargerJournaux() {
    this.natureOperationService.getAllCodeJournal().subscribe({
      next: (data: any) => {
        this.journaux = data;
        this.filteredJournaux = [...this.journaux];
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log("Erreur lors du chargement des journaux", error);
        this.notification.showError("erreur lors du chargement des journaux");
      },
    });
  }

  chargerTiers() {
    this.tiersService.getAll().subscribe({
      next: (data: any) => {
        this.tiersList = data;
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log("Erreur lors du chargement des tiers", error);
        this.notification.showError("erreur lors du chargement des tiers");
      },
    });
  }

  chargerArticles() {
    this.articleService.getAllWithRelations().subscribe({
      next: (data: any[]) => {
        this.articles = data;
        this.filteredArticles = [...data];
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log("Erreur lors du chargement des categories", error);
        this.notification.showError("Erreur lors du chargement des articles");
      },
    });
  }

  chargerSectionsAnalytiques() {
    this.sectionAnalytiqueService.getAllSectionAnalytiques().subscribe({
      next: (data: SectionAnalytique[]) => {
        this.sectionsAnalytiques = data.map((d) => ({
          id: d.id,
          code: d.code,
          libelle: d.libelle,
        }));
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log(
          "Erreur lors du chargement des sections analytiques",
          error
        );
        this.notification.showError(
          "erreur lors du chargement des sections analytiques"
        );
      },
    });
  }

  chargerComptables(typeNature: string) {
    this.planComptableService.getByTypeNature(typeNature).subscribe({
      next: (data: PlanComptable[]) => (this.comptables = data),
      error: (err: any) => this.notification.showError(err),
    });
  }

  chargerPlansAnalytiques() {
    this.planAnalytiqueService.getAllPlanAnalytique().subscribe({
      next: (data: PlanAnalytiqueDTO[]) => {
        this.plansAnalytiques = data.map((d) =>
          this.fb.group({
            id: [d.id],
            intitule: [d.intitule],
          })
        );
      },
      error: (err) => {
        console.error("Erreur lors du chargement des tiers", err);
        this.notification.showError("Erreur..");
      },
    });
  }

  chargerComptesComptables() {
    this.compteComptableService.getAll().subscribe({
      next: (data: CompteComptableDTO[]) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des comptes comptables", err);
        this.notification.showError(
          "Erreur lors du chargement des comptes comptables"
        );
      },
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
        popup: "swal2-custom-popup",
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.natureOperationService.delete(nature.id!).subscribe({
          next: () => {
            this.natureOperations = [];
            this.chargerOperationPageable();
            Swal.fire("Succès", "Nature supprimée avec succès.", "success");
          },
          error: () => {
            Swal.fire("Erreur", "Une erreur s'est produite.", "error");
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Abandonné", "Suppression annulée", "info");
      }
    });
  }

  openModal(): void {
    this.operationForm.reset();
    this.patchForm();
    this.modalService.open(this.modalContent, { size: "lg", centered: true });
  }

  patchForm() {
    this.operationForm.patchValue({
      societeId: this.societeBi.id,
      userId: this.userBi.id,
      exerciceId: this.exerciceBi.id,
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.operationForm.reset();
  }

  editNature(index: number): void {
    this.selectedIndex = index;
    const nature = this.lignes[index];
    this.selected = nature;
    this.operationForm.patchValue(nature);
    this.modalService.open(this.modalContent, { size: "lg", centered: true });
  }

  deleteNature(index: number): void {
    const nature = this.natureOperations[index].value;
    this.deleteNatureOperationDto(nature);
  }

  pages(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i);
  }

  goToPage(page: number = 0) {
    this.chargerOperationPageable(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  onFilterChange(): void {
    this.search$.next({
      libelle: this.searchTerm,
      journalId: this.selectedJournalId,
      categorieId: this.selectedCategorieId,
      tiersId: this.selectedTiersId,
      societeId: this.selectedSocieteId,
    });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((filters) => {
          this.currentPage = 0;

          const journalId = filters.journalId || undefined;
          const categorieId = filters.categorieId || undefined;
          const tiersId = filters.tiersId || undefined;
          const libelle = filters.libelle?.trim() || undefined;
          const societeId = filters.societeId || undefined;

          return this.natureOperationService.getByFilters(
            this.currentPage,
            this.pageSize,
            journalId,
            categorieId,
            tiersId,
            libelle,
            societeId
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.natureOperations = data.content;
          this.lignes = [...this.natureOperations];
          this.totalElements = data.totalElements;
          this.isLoading = false;
          this.result = true;
        },
        error: (err) => {
          console.error("Erreur lors de la recherche des écritures", err);
          this.isLoading = false;
          this.result = true;
        },
      });
  }
}

