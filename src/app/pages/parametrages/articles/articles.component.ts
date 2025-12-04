import { ArticleDTO } from "src/app/models/article.model";
import { ArticlesService } from "src/app/services/articles/articles.service";
import { TypeCategorieService } from "../../../services/type-categorie/type-categorie.service";
import { SocieteService } from "src/app/services/societe/societe.service";
import { Societe } from "src/app/models/societe.model";
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import { debounceTime, finalize, Subject, switchMap, tap } from "rxjs";
import { CompteComptableService } from "src/app/services/comptes-comptables/comptes-comptables.service";
import { CompteComptableDTO } from "src/app/models/compte-comptable";
import { TypeCategorie } from "src/app/models/type-categorie.model";
import { TypeMouvement } from "src/app/models/type-mouvement.model";
import { ControlesFormulairesService } from "src/app/services/composite/controles-formulaires/controles-formulaires.service";
import { AuthenticationService } from "src/app/core/service/auth.service"; // Added import
import { NatureOperationService } from "src/app/services/operations/operations.service";

@Component({
  selector: "app-articles-component",
  templateUrl: "./articles.component.html",
  styleUrl: "./articles.component.scss",
  standalone: false,
})
export class ArticlesComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild("importExcelModal", { static: true })
  importExcelModal!: TemplateRef<any>;

  @ViewChild("searchInputDesignation", { static: true })
  searchInputDesignation!: ElementRef<HTMLInputElement>;

  closeResult: string = "";
  articles: ArticleDTO[] = [];
  lignes: any[] = [];
  societes: any[] = [];
  comptes: CompteComptableDTO[] = [];
  typesCategorie: { id: any; libelle: any }[] = [];

  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  private search$ = new Subject<{ designation: string }>();
  searchDesignation: string;

  selectedIndex: number | null = null;
  articleForm!: UntypedFormGroup;
  modelImportForm: UntypedFormGroup;
  excelFile: File | null = null;
  fileError: string | null = null;
  importResult: any | null = null;
  isLoading = false;
  formVisible = false;
  result = false;
  currentUser: any;
  currentSociete: Societe;
  userBi: any;
  pageTitle: { label: string; path: string; active: boolean }[];

  isUserEntreprise: boolean = false; // Added property
  journaux: any;

  constructor(
    private articleService: ArticlesService,
    private societeService: SocieteService,
    private notification: NotificationService,
    private fb: UntypedFormBuilder,
    private compteComptableService: CompteComptableService,
    private modalService: NgbModal,
    private typeCategorieService: TypeCategorieService,
    public controleForm: ControlesFormulairesService,
    private authService: AuthenticationService,
    private journalService: NatureOperationService
  ) {
    this.articleForm = this.fb.group({
      id: [""],
      designation: [
        "",
        [Validators.required, Validators.pattern(/^[\p{L}\d\s\-]+$/u)],
      ],
      prixUnitaire: [null],
      quantite: [null],
      societeId: [null],
      userId: [null],
      comptesParMouvementCategorie: this.fb.array([], Validators.required),
    });

    this.modelImportForm = this.fb.group({
      societeId: [null],
      fichierExcel: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.isUserEntreprise = this.authService.isEntrepriseUser(); // Set property here
    this.pageTitle = [{ label: "Vos articles", path: "/", active: true }];

    const societeActiveStr = sessionStorage.getItem("societeActive");
    const userActive = sessionStorage.getItem("user");
    if (societeActiveStr && userActive) {
      this.currentSociete = JSON.parse(societeActiveStr);
      this.userBi = JSON.parse(userActive);
    }

    this.chargerArticles();
    // this.chargerSocietes();
    this.chargerComptesComptables();
    this.initSearchListener();
    this.chargerTypesCategories();
    this.chargerJournaux();
  }

  searchCompte = (term: string, item: any) => {
    if (!term) return true;
    return item.code.toLowerCase().startsWith(term.toLowerCase());
  };

  chargerJournaux() {
    this.journalService.getAllCodeJournal().subscribe({
      next: (data: any) => {
        this.journaux = data;
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log("Erreur lors du chargement des journaux", error);
        this.notification.showError("erreur lors du chargement des journaux");
      },
    });
  }

  chargerTypesCategories() {
    this.typeCategorieService.getAll().subscribe({
      next: (data: TypeCategorie[]) => {
        this.typesCategorie = data.map((t) => ({ id: t, libelle: t }));
      },
      error: () =>
        this.notification.showError("Erreur lors du chargement des types"),
    });
  }

  resetForm() {
    this.articleForm.reset();
    this.articleForm.patchValue({
      societeId: this.currentSociete.id,
      userId: this.userBi.id,
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.resetForm();
  }

  pages(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i);
  }

  goToPage(page: number) {
    this.chargerArticles(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get comptesParMouvementCategorie(): FormArray {
    return this.articleForm.get("comptesParMouvementCategorie") as FormArray;
  }

  addQuadruple(
    typeCategorie?: string,
    typeMouvement?: string,
    compteId?: number,
    journalId?: number
  ): void {
    const group = this.fb.group({
      typeCategorie: [typeCategorie ?? null, Validators.required],
      typeMouvement: [typeMouvement ?? null, Validators.required],
      compteId: [compteId ?? null, Validators.required],
      journalId: [journalId ?? null, Validators.required],
    });
    this.comptesParMouvementCategorie.push(group);
  }

  removeQuadruple(index: number): void {
    this.comptesParMouvementCategorie.removeAt(index);
  }

  loadArticle(article: ArticleDTO) {
    this.articleForm.patchValue({
      id: article.id,
      designation: article.designation,
      prixUnitaire: article.prixUnitaire,
      quantite: article.quantite,
      societeId: this.currentSociete.id,
      userId: this.userBi.id,
    });

    this.clearComptes();
    if (article.comptesParCategorie?.length) {
      article.comptesParCategorie.forEach((c) =>
        this.addQuadruple(c.typeCategorie, c.typeMouvement, c.compteId,  c.journalId )
      );
    }
  }
  /**
   *
   * @param page
   * @author VICTORIN
   * chargement d'articles paginés avec ou sans filtre
   */
  chargerArticles(page: number = 0) {
    this.result = false;
    this.isLoading = true;
    this.currentPage = page;

    this.articleService
      .getAllPageable(page, this.pageSize, this.searchDesignation || "")
      .subscribe({
        next: (data: { content: ArticleDTO[]; totalElements: number }) => {
          this.articles = data.content;
          this.lignes = [...this.articles];
          this.totalElements = data.totalElements;
          this.result = true;
          this.isLoading = false;
        },
        error: () => {
          this.result = true;
          this.isLoading = false;
          this.notification.showError("Erreur de chargement");
        },
      });
  }

  chargerComptesComptables() {
    this.compteComptableService.getAll().subscribe({
      next: (data: CompteComptableDTO[]) => (this.comptes = data),
      error: () =>
        this.notification.showError(
          "Erreur lors du chargement des comptes comptables"
        ),
    });
  }

  // chargerSocietes() {
  //   this.societes = [];
  //   this.societeService.getAllSociete().subscribe({
  //     next: (data: Societe[]) => this.societes = data.map(d => ({ id: d.id, nom: d.nom })),
  //     error: () => this.notification.showError('Erreur lors du chargement des sociétés')
  //   });
  // }

  ajouter(): void {
    this.formVisible = true;
  }
  modifier(): void {
    if (this.selectedIndex !== null) this.formVisible = true;
  }
  supprimer(): void {
    if (this.selectedIndex !== null)
      this.deleteArticle(this.lignes[this.selectedIndex]);
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[index] as ArticleDTO;
    this.loadArticle(currentData);
  }

  enregistrer(): void {
    this.modalService.dismissAll();
    this.articleForm.patchValue({
      societeId: this.currentSociete.id,
      userId: this.userBi.id,
    });
    console.log(this.articleForm.value);
    if (this.articleForm.invalid) {
      this.notification.showWarning("Formulaire invalide");
      return;
    }
    this.result = false;
    this.isLoading = true;
    const articleData = this.articleForm.value;
    console.log(articleData);
    const action$ = articleData.id
      ? this.articleService.update(articleData.id, articleData)
      : this.articleService.create(articleData);

    action$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        const msg = articleData.id ? "Modifié" : "Enregistré";
        this.notification.showSuccess(`${msg} avec succès`);
        this.chargerArticles();
        this.formVisible = false;
      },
      error: (err) => this.notification.showError(err.error.message || "Erreur lors de l'enregistrement"),
    });
  }

  deleteArticle(article: ArticleDTO) {
    Swal.fire({
      title: "Supprimer l’article",
      html: `<p><strong>Article : </strong><span style="color: #009879; font-size: 1.2em;">${article.designation}</span></p>`,
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.delete(article.id!).subscribe({
          next: () => {
            this.lignes = [];
            this.chargerArticles();
            this.notification.showSuccess("Article supprimé avec succès !");
          },
          error: () =>
            this.notification.showError("Erreur lors de la suppression"),
        });
      }
    });
  }

  clearComptes() {
    const comptesArray = this.articleForm.get(
      "comptesParMouvementCategorie"
    ) as FormArray;
    comptesArray.clear();

    comptesArray.push(
      this.fb.group({
        typeCategorie: [null],
        typeMouvement: [null],
        compteId: [null],
        journalId: [null],
      })
    );
  }

  editArticle(index: number) {
    this.isLoading = true;
    this.selectedIndex = index;
    const articleBi = this.lignes[index];

    this.articleService.getArticleById(articleBi.id).subscribe({
      next: (detail: any) => {
        const comptesArray = this.articleForm.get(
          "comptesParMouvementCategorie"
        ) as FormArray;
        comptesArray.clear();

        if (detail.comptesParCategorie?.length) {
          detail.comptesParCategorie.forEach((c: any) =>
            comptesArray.push(
              this.fb.group({
                typeCategorie: [c.typeCategorie],
                typeMouvement: [c.typeMouvement],
                compteId: [c.compteId],
                journalId: [c.journalId],
              })
            )
          );
        }

        this.articleForm.patchValue({
          ...detail,
        });

        this.modalService
          .open(this.modalContent, { windowClass: "modal-custom", centered: true })
          .result.finally(() => this.articleForm.reset());
        this.isLoading = false;
      },
      error: (err: any) => {
        this.notification.showError(err);
      },
    });
  }

  private initSearchListener() {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(({ designation }) =>
          this.articleService.getAllPageable(
            0,
            this.pageSize,
            designation || ""
          )
        )
      )
      .subscribe({
        next: (data) => {
          this.lignes = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: (err) => (this.isLoading = false),
      });
  }

  onFilterChange(): void {
    this.search$.next({ designation: this.searchDesignation });
  }

  openModal() {
    this.clearComptes();
    this.resetForm();
    this.formVisible = true;
    this.modalService
      .open(this.modalContent, {  windowClass: "modal-custom", centered: true })
      .result.finally(() => this.articleForm.reset());
  }
}
