import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {

  categories: any[] = [];
  categorieForm!: UntypedFormGroup;
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult: string = '';
  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  result: boolean = false;
  types: any[] = [];
  lastTypeId: number;
  selectedTypeId: number;

  constructor(
    private categorieService: CategorieService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private typeCategorieService: TypeCategorieService
  ) {
    this.categorieForm = this.fb.group({
      code: ['', [Validators.required]],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      type: ['null', [Validators.required]],
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
  // trouve le type dans ton tableau
  const selectedType = this.types.find(t => t.id === selectedId);
  console.log('selectedType:', selectedType);
  
  if (selectedType) {
    // calcule le dernier id pour ce type dans categories
    const idsForType = this.categories
      .map(c => c.value)
      .filter(c => c.type?.id === selectedId)
      .map(c => Number(c.id));

    const maxId = idsForType.length ? Math.max(...idsForType) : 0;

    this.lastTypeId = maxId + 1;

    // patch dans le formulaire
    this.categorieForm.patchValue({
      code: `${selectedType.code}${this.lastTypeId.toString().padStart(8, '0')}`,
      // id: `${this.selected}`, 
    });

    console.log('lastTypeId:', this.lastTypeId);
    console.log('Form mis à jour:', this.categorieForm.value);
  }
}

  chargerCategories() {
    this.categories = [];
    this.categorieService.getAllCategories().subscribe({
      next: (data: any) => {
        for (let d of data) {
          this.categories.push(this.fb.group({
            id: d.id,
            code: d.code,
            libelle: d.libelle,
            type: d.type
          }));
        }
        this.result = true;
      },
      error: (error: any) => {
        this.result = true;
        console.log('Erreur lors du chargement des categories', error);
        this.showError("Erreur lors du chargement des catégories");
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
        this.showError("Erreur lors du chargement des types");
      }
    });
  }

  onSaveCategorie(categorieFormValue: UntypedFormGroup) {
    categorieFormValue.patchValue({ type: this.selectedTypeId });

    if (categorieFormValue.valid) {
      this.categorieService.creerCategorie(categorieFormValue.value).subscribe({
        next: (response: any) => {
          this.showSuccess('Enregistré avec succès');
          this.loading = false;
          this.chargerCategories();
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.showError('Erreur serveur');
        }
      });
    } else {
      this.showWarning('Formulaire invalide');
    }
  }

  deleteCategorie(categorieFormValue: any) {
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

  onUpdateCategorie(categorieFormValue: any) {
    if (categorieFormValue.valid) {
      this.categorieService.modifierCategorie(categorieFormValue.value.id, categorieFormValue.value).subscribe({
        next: () => {
          this.showSuccess('Modifié avec succès');
          this.loading = false;
          this.chargerCategories();
          this.result = true;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.showError('Erreur serveur');
        }
      });
    } else {
      this.showWarning('Formulaire invalide');
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message + '!', 'Success', { timeOut: 5000, positionClass: 'toast-top-right', progressBar: true, closeButton: true });
  }
  showError(message: string) {
    this.toastr.error(message + '!', 'Error', { timeOut: 5000, positionClass: 'toast-top-right', progressBar: true, closeButton: true });
  }
  showWarning(message: string) {
    this.toastr.warning(message + '!', 'Warning', { timeOut: 5000, positionClass: 'toast-top-right', progressBar: true, closeButton: true });
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.categorieForm.reset();
    this.modalService.open(content, {
      size: 'lg', centered: true, scrollable: true,
      backdrop: 'static', keyboard: false
    });
  }

  openEditModal(editcontent: TemplateRef<NgbModal>): void {
    this.modalService.open(editcontent, {
      size: 'lg', centered: true, scrollable: true,
      backdrop: 'static', keyboard: false
    });
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
