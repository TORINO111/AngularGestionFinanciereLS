import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BailleurService } from 'src/app/services/bailleurs/bailleur.service';
import { Bailleur } from 'src/app/models/bailleur.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bailleurs',
  templateUrl: './bailleurs.component.html',
  styleUrls: ['./bailleurs.component.scss'],
  standalone: false
})
export class BailleursComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  pageTitle: BreadcrumbItem[] = [];
  bailleurs: Bailleur[] = [];
  bailleurForm: FormGroup;
  selectedBailleur: Bailleur | null = null;
  isLoading = false;
  result = false;
  
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private bailleurService: BailleurService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.bailleurForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      clientNumexisId: ['', Validators.required],
      clientNumexisNom: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Bailleurs', path: '/', active: true }];
    this.loadBailleurs();
  }

  loadBailleurs(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    this.bailleurService.getAllPageable(page, this.pageSize).subscribe({
      next: (data) => {
        this.bailleurs = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        this.result = true;
      },
      error: (err) => {
        this.notification.showError('Erreur de chargement des bailleurs');
        this.isLoading = false;
        this.result = true;
      }
    });
  }

  openModal(bailleur?: Bailleur): void {
    this.selectedBailleur = bailleur || null;
    this.bailleurForm.reset();
    if (bailleur) {
      this.bailleurForm.patchValue(bailleur);
    }
    this.modalService.open(this.modalContent, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.bailleurForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const bailleurData = this.bailleurForm.value;
    const action$ = bailleurData.id
      ? this.bailleurService.update(bailleurData.id, bailleurData)
      : this.bailleurService.create(bailleurData);

    action$.subscribe({
      next: () => {
        const msg = bailleurData.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`Bailleur ${msg} avec succès`);
        this.loadBailleurs();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(err.error.message || 'Une erreur est survenue');
      }
    });
  }

  deleteBailleur(bailleur: Bailleur): void {
    Swal.fire({
      title: 'Supprimer le bailleur',
      text: `Êtes-vous sûr de vouloir supprimer le bailleur ${bailleur.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bailleurService.delete(bailleur.id).subscribe({
          next: () => {
            this.notification.showSuccess('Bailleur supprimé avec succès');
            this.loadBailleurs();
          },
          error: (err) => {
            this.notification.showError(err.error.message || 'Une erreur est survenue');
          }
        });
      }
    });
  }
  
  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    this.loadBailleurs(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
