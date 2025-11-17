import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CohorteService } from 'src/app/services/cohortes/cohorte.service';
import { Cohorte } from 'src/app/models/cohorte.model';
import { Bailleur } from 'src/app/models/bailleur.model';
import { BailleurService } from 'src/app/services/bailleurs/bailleur.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cohortes',
  templateUrl: './cohortes.component.html',
  styleUrls: ['./cohortes.component.scss'],
  standalone: false
})
export class CohortesComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  pageTitle: BreadcrumbItem[] = [];
  cohortes: Cohorte[] = [];
  bailleurs: Bailleur[] = [];
  cohorteForm: FormGroup;
  selectedCohorte: Cohorte | null = null;
  isLoading = false;
  result = false;
  user:any;
  canAlter: boolean = false;

  searchTerm: string = '';
  selectedBailleurId?: number;

  private search$ = new Subject<void>();
  
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private cohorteService: CohorteService,
    private bailleurService: BailleurService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.cohorteForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      bailleurId: [null, Validators.required]
    });
    const userJson = localStorage.getItem('user');
    this.user = userJson ? JSON.parse(userJson) : null;
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Cohortes', path: '/', active: true }];
    if(this.user && (this.user.role === 'ADMIN' || this.user.role === 'CLIENT_ADMIN' || this.user.role === 'CLIENT_COMPTABLE')) {
      this.canAlter = true;
    }
    this.loadCohortes();
    this.loadBailleurs();
    this.initSearchListener();
  }

  onFilterChange(): void {
    this.search$.next();
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(() => {
          this.currentPage = 0;
          return this.cohorteService.getAllPageable(
            0,
            this.pageSize,
            this.searchTerm || undefined,
            this.selectedBailleurId || undefined
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.cohortes = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de la recherche', err);
        },
      });
  }

  loadCohortes(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    this.cohorteService.getAllPageable(
      page,
      this.pageSize,
      this.searchTerm || undefined,
      this.selectedBailleurId || undefined
    ).subscribe({
      next: (data) => {
        this.cohortes = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        this.result = true;
      },
      error: (err) => {
        this.notification.showError('Erreur de chargement des cohortes');
        this.isLoading = false;
        this.result = true;
      }
    });
  }

  loadBailleurs(): void {
    this.bailleurService.getAll().subscribe({
      next: (data) => {
        this.bailleurs = data;
      },
      error: (err) => {
        this.notification.showError('Erreur de chargement des bailleurs');
      }
    });
  }

  openModal(cohorte?: Cohorte): void {
    this.selectedCohorte = cohorte || null;
    this.cohorteForm.reset();
    if (cohorte) {
      this.cohorteForm.patchValue(cohorte);
    }
    this.modalService.open(this.modalContent, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.cohorteForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const cohorteData = this.cohorteForm.value;
    const action$ = cohorteData.id
      ? this.cohorteService.update(cohorteData.id, cohorteData)
      : this.cohorteService.create(cohorteData);

    action$.subscribe({
      next: () => {
        const msg = cohorteData.id ? 'Modifiée' : 'Enregistrée';
        this.notification.showSuccess(`Cohorte ${msg} avec succès`);
        this.loadCohortes();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(err.error.message || 'Une erreur est survenue');
      }
    });
  }

  deleteCohorte(cohorte: Cohorte): void {
    Swal.fire({
      title: 'Supprimer la cohorte',
      text: `Êtes-vous sûr de vouloir supprimer la cohorte ${cohorte.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cohorteService.delete(cohorte.id).subscribe({
          next: () => {
            this.notification.showSuccess('Cohorte supprimée avec succès');
            this.loadCohortes();
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
    this.loadCohortes(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
