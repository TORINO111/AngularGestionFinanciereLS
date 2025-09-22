import { Categorie } from './../../../models/categorie.model';
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, distinctUntilChanged, fromEvent, switchMap } from 'rxjs';
import { Subject } from 'rxjs';

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
  lignes = [...this.categories];

  searchTerm: string = '';
  selectedType?: string;

  totalElements: number = 0;
  pageSize: number = 3;
  currentPage: number = 0;
  private search$ = new Subject<{ libelle: string; type?: string }>();

  closeResult: string = '';
  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  result: boolean = false;
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

  constructor(
    private categorieService: CategorieService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private typeCategorieService: TypeCategorieService,
    private notification: NotificationService
  ) {
    this.categorieForm = this.fb.group({
      id: [null],
      libelle: ['', [Validators.required, Validators.minLength(5)]],
      type: ['null', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos Catégories', path: '/', active: true }];
    this.chargerCategories();
    this.chargerTypesCategorie();
    this.initSearchListener()
  }

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchTerm, type: this.selectedType });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
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
        },
        error: err => console.error('Erreur lors de la recherche', err)
      });
  }


  /** Appelé dans le template sur (keyup) */
  // onKeyup(value: string): void {
  //   this.search$.next(value);
  // }

  onSelected(event: Event) {
    // récupère l'id du type sélectionné
    const selectedId = this.categorieForm.get('type')?.value;
    console.log('selectedId:', selectedId);
    this.selectedTypeId = selectedId;
  }

  chargerCategories(page: number = 0) {
    this.result = false;
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
        },
        error: (error) => {
          this.result = true;
          console.error("Erreur lors du chargement des catégories:", error);
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

  // chargerCategories() {
  //   this.categories = [];
  //   this.categorieService.getAllCategories().subscribe({
  //     next: (data: Categorie[]) => {
  //       this.categories = data.map(d => ({
  //         id: d.id,
  //         code: d.code,
  //         libelle: d.libelle,
  //         type: d.type
  //       }));
  //       this.result = true;
  //     },
  //     error: (error: any) => {
  //       this.result = true;
  //       this.notification.showError("Erreur lors du chargement des catégories: " + error);
  //     }
  //   });
  // }

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

    if (categorieFormValue.valid) {
      this.categorieService.creerCategorie(categorieFormValue.value).subscribe({
        next: (response: any) => {
          this.notification.showSuccess('Enregistré avec succès');
          this.loading = false;
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
  }

  onUpdateCategorie(categorieFormValue: FormGroup) {

    if (categorieFormValue.valid) {
      const formValue = categorieFormValue.value;

      this.categorieService.modifierCategorie(formValue.id, formValue).subscribe(
        {
          next: resp => {
            const body: any = resp;

            this.notification.showSuccess('Modifié avec succès');
            this.loading = false;
            this.chargerCategories();
            this.result = true;
          },
          error: (error) => {
            this.notification.showError(error);
            this.loading = false;
          }
        });
    } else {
      this.notification.showWarning('Formulaire invalide');
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.categorieForm.reset();
    this.selectedIndex = null;
  }

  openModal(): void {
    this.categorieForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.categorieModal, { centered: true });
  }

  editCategorie(index: number): void {
    this.selectedIndex = index;
    const c = this.categories[index];
    this.categorieForm.patchValue({
      id: c.id,
      libelle: c.libelle,
      type: c.type
    });
    this.modalService.open(this.categorieModal, { centered: true });
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
    console.log(this.categorieForm.value);
    if (this.categorieForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const categorie = this.categorieForm.value as Categorie;
    console.log(categorie);

    const action$ = categorie.id!
      ? this.categorieService.modifierCategorie(categorie.id, categorie)
      : this.categorieService.creerCategorie(categorie);

    action$.subscribe({
      next: () => {
        this.loading = false;
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.categorieForm.reset();
        this.selectedIndex = null;
        this.selected = undefined;
        this.isLoading = false;
        this.chargerCategories();
      },
      error: (error: any) => {
        this.notification.showError(error);
        this.isLoading = false;
        this.categorieForm.reset();
        this.selectedIndex = null;
        this.selected = false;
        this.chargerCategories();
      }
    });
    this.closeModal();
  }

}
