import { Categorie } from './../../../models/categorie.model';
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, switchMap, tap } from 'rxjs';
import { Subject } from 'rxjs';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { CompteComptableDTO } from 'src/app/models/compte-comptable';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CategorieComponent implements OnInit {
  @ViewChild('categorieModal', { static: true }) categorieModal!: TemplateRef<any>;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  categories: any[] = [];
  categorie!: UntypedFormGroup;
  categorieForm!: UntypedFormGroup;
  lignes: any;

  searchTerm: string = '';
  selectedType?: string;

  totalElements: number = 0;
  pageSize: number = 3;
  currentPage: number = 0;

  private search$ = new Subject<{ libelle: string; type?: string }>();

  closeResult: string = '';
  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  result = false;
  types: any[] = [];
  lastTypeId: number;
  selectedTypeId: number;

  initialLibelle: string = '';
  initialTypeId?: number;

  currentLibelle: string = '';
  currentTypeId?: number;

  isLoading = false;

  canModify: boolean = false;
  errorMessage: string;
  selectedIndex: number | null = null;
  selected?: boolean = false;
  comptes: CompteComptableDTO[];
  societeBi: any;

  constructor(
    private categorieService: CategorieService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private typeCategorieService: TypeCategorieService,
    private compteComptableService: CompteComptableService,
    private notification: NotificationService
  ) {
    this.categorieForm = this.fb.group({
      id: [null],
      libelle: ['', [Validators.required, Validators.minLength(5)]],
      type: ['null', [Validators.required]],
      comptesComptablesIds: [[], [Validators.required]],
      societeId: [null]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos Catégories', path: '/', active: true }];
    this.chargerCategories();
    this.chargerTypesCategorie();
    this.initSearchListener();
    this.chargerComptesComptables();

    const societeActiveStr = localStorage.getItem("societeActive");
    if (societeActiveStr) {
      this.societeBi = JSON.parse(societeActiveStr);
      this.categorieForm.patchValue({ societeId: this.societeBi.id });
    };
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

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchTerm, type: this.selectedType });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(({ libelle, type }) => {
          this.currentPage = 0;
          return this.categorieService.getCategories(
            0,
            this.pageSize,
            libelle || undefined,
            type || undefined
          );
        })
      )
      .subscribe({
        next: data => {
          this.categories = data.content;
          this.lignes = this.categories;
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

  onSelected(event: Event) {
    // récupère l'id du type sélectionné
    const selectedId = this.categorieForm.get('type')?.value;
    console.log('selectedId:', selectedId);
    this.selectedTypeId = selectedId;
  }

  chargerCategories(page: number = 0) {
    this.result = false;
    this.isLoading = true;

    this.currentPage = page;

    this.categorieService.getCategories(
      page,
      this.pageSize,
      this.searchTerm ? this.searchTerm : undefined,
      this.selectedType ? this.selectedType : undefined
    )
      .subscribe({
        next: (data) => {
          this.categories = data.content;
          this.lignes = [...this.categories];
          this.totalElements = data.totalElements;
          this.result = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.result = true;
          this.isLoading = false;
          console.error("Erreur lors du chargement des catégories:", error);
          this.notification.showError('Erreur de chargement');
        }
      });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    this.chargerCategories(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  chargerTypesCategorie() {
    this.typeCategorieService.getAll().subscribe({
      next: (data: any[]) => {
        this.types = data.map(t => ({ id: t, libelle: t }));
        this.lastTypeId = data[data.length - 1].id;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types', err);
        this.notification.showError("Erreur lors du chargement des types");
      }
    });
  }

  onSaveCategorie(categorieFormValue: UntypedFormGroup) {
    // categorieFormValue.patchValue({ type: this.selectedTypeId });
    this.result = false;
    this.loading = true

    if (categorieFormValue.valid) {
      this.categorieService.creerCategorie(categorieFormValue.value).subscribe({
        next: (response: any) => {
          this.notification.showSuccess('Enregistré avec succès');
          this.chargerCategories();
        },
        error: (error) => {
          this.loading = false;
          this.notification.showError(error);
        }
      });
    } else {
      this.notification.showWarning('Formulaire invalide');
    }
    this.loading = false;
    this.result = true;
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.selectedIndex = null;
  }

  openModal(): void {
    this.selectedIndex = null;
    this.modalService.open(this.categorieModal, { size: 'lg', centered: true });
  }

  editCategorie(index: number): void {
    this.closeModal();
    this.selectedIndex = index;
    const c = this.categories[index];
    console.log(c);

    this.categorieForm.patchValue({
      id: c.id,
      libelle: c.libelle,
      type: c.type,
      comptesComptablesIds: c.compteComptableIds || []
    });

    this.modalService.open(this.categorieModal, { size: 'lg', centered: true });
  }

  deleteCategorie(index: number): void {
    const c = this.categories[index];
    if (!confirm(`Supprimer la catégorie "${c.libelle}" ?`)) return;

    this.categorieService.supprimerCategorie(c.id).subscribe({
      next: () => {
        this.notification.showSuccess('Catégorie supprimée avec succès');
        this.chargerCategories();
      },
      error: () => this.notification.showError('Erreur lors de la suppression')
    });
  }

  enregistrer(): void {
    this.closeModal();
    this.isLoading = true;
    this.result = false;

    if (this.categorieForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      this.isLoading = false;
      this.result = true;
      return;
    }

    const categorie = this.categorieForm.value as Categorie;

    const action$ = categorie.id!
      ? this.categorieService.modifierCategorie(categorie.id, categorie)
      : this.categorieService.creerCategorie(categorie);

    action$.subscribe({
      next: () => {
        this.chargerCategories();
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.result = true;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notification.showError(error);
        this.result = true;
        this.isLoading = false;
      }
    });
  }


}
