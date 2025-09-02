import { Categorie } from './../../../models/categorie.model';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {

  categories: any[] = [];
  categorie!: UntypedFormGroup;
  categorieForm!: UntypedFormGroup;
  categorieUpdateForm!: UntypedFormGroup
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult: string = '';
  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  result: boolean = false;
  types: any[] = [];
  lastTypeId: number;
  selectedTypeId: number;

  initialLibelle: string = '';
  initialTypeId: number | null = null;

  currentLibelle: string = '';
  currentTypeId: number | null = null;

  canModify: boolean = false;
  errorMessage: string;

  constructor(
    private categorieService: CategorieService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private typeCategorieService: TypeCategorieService,
    private notification: NotificationService
  ) {
    this.categorieForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(5)]],
      type: ['null', [Validators.required]],
    });

    this.categorie = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(5)]],
      type: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: '', path: '/', active: true }];
    this.chargerCategories();
    this.chargerTypesCategorie();
  }


  onSelected(event: Event) {
    // récupère l'id du type sélectionné
    const selectedId = this.categorieForm.get('type')?.value;
    console.log('selectedId:', selectedId);
    this.selectedTypeId = selectedId;
  }

  chargerCategories() {
    this.categories = [];
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

  chargerTypesCategorie() {
    this.typeCategorieService.getAll().subscribe({
      next: (data: any[]) => {
        this.types = data.map(t => ({ id: t.id, code: t.code, libelle: t.libelle }));
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
          console.log(error);
          this.loading = false;
          this.notification.showError('Erreur serveur');
        }
      });
    } else {
      this.notification.showWarning('Formulaire invalide');
    }
  }

  deleteCategorie(categorieFormValue: any) {
    
    console.log(categorieFormValue);

    Swal.fire({
      title: 'Supprimer la Catégorie',
      html: `<p><strong></strong> <span style="color: #009879;font-size: 1.5em;">${categorieFormValue.libelle}</span></p>`,
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-trash-alt" ></i> Supprimer',
      cancelButtonText: '<i class="fa fa-ban" ></i> Annuler',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'btn btn-danger  me-2',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.categorieService.supprimerCategorie(categorieFormValue.id).subscribe({
          next: () => {
            this.chargerCategories();
            Swal.fire('Succès', `La rubrique a été supprimée avec succès.`, 'success');
          },
          error: (err) => {
            console.log(err)
            Swal.fire('Erreur', `Une erreur s'est produite`, 'error');
          }
        });
      }
    });
  }

  onUpdateCategorie(categorieFormValue: FormGroup) {
    console.log('Form values:', categorieFormValue.value); // contient les modifications

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
        console.log("err :", error);
        this.notification.showError(JSON.stringify(error));

        console.log(error);
        this.loading = false;
      }
    });
  } else {
    this.notification.showWarning('Formulaire invalide');
  }
}

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.categorieForm.reset();
    this.modalService.open(content, {
      size: 'lg', centered: true, scrollable: true,
      backdrop: 'static', keyboard: false
    });
  }

  openEditModal(categorie: Categorie, editcontent: TemplateRef<any>): void {
  if (!categorie) {
    console.error('Categorie undefined dans openEditModal');
    return;
  }

  console.log('Categorie reçue :', categorie);

  // Création du FormGroup à partir de l'objet métier
  this.categorieUpdateForm = this.fb.group({
    id:[categorie.id],
    libelle: [categorie.libelle?.trim() ?? '', [Validators.required, Validators.minLength(5)]],
    type: [categorie.type?.id ?? categorie.type ?? null, Validators.required]
  });

  // Initialisation des valeurs de référence pour comparaison
  this.initialLibelle = categorie.libelle?.trim() ?? '';
  this.initialTypeId = categorie.type?.id ?? categorie.type ?? null;

  // Valeurs actuelles (seront mises à jour via listenToChanges)
  this.currentLibelle = this.initialLibelle;
  this.currentTypeId = this.initialTypeId;

  this.canModify = false;

  // Écoute des changements pour activer/désactiver le bouton Modifier
  this.listenToChanges();

  // Ouverture du modal
  this.modalService.open(editcontent, {
    size: 'lg',
    centered: true,
    scrollable: true,
    backdrop: 'static',
    keyboard: false
  });
}

  listenToChanges(): void {
    this.categorie.get('libelle')?.valueChanges.subscribe(value => {
      this.currentLibelle = value?.trim();
      this.evaluateCanModify();
    });

    this.categorie.get('type')?.valueChanges.subscribe(value => {
      this.currentTypeId = value;
      this.evaluateCanModify();
    });
  }
  evaluateCanModify(): void {
    this.canModify =
      this.currentLibelle !== this.initialLibelle ||
      this.currentTypeId !== this.initialTypeId;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
