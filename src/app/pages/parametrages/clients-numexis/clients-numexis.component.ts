import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientNumexisService } from 'src/app/services/clients-numexis/client-numexis.service';
import { ClientNumexis } from 'src/app/models/client-numexis.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients-numexis',
  templateUrl: './clients-numexis.component.html',
  styleUrls: ['./clients-numexis.component.scss'],
  standalone: false
})
export class ClientsNumexisComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  pageTitle: BreadcrumbItem[] = [];
  clients: ClientNumexis[] = [];
  clientForm: FormGroup;
  selectedClient: ClientNumexis | null = null;
  isLoading = false;
  result = false;
  
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private clientNumexisService: ClientNumexisService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.clientForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      sigle: [''],
      telephone: [''],
      email: ['', Validators.email],
      adresse: [''],
      numeroRccm: [''],
      numeroIFU: [''],
      ville: [''],
      pays: ['']
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Clients Numexis', path: '/', active: true }];
    this.loadClients();
  }

  loadClients(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    this.clientNumexisService.getAllPageable(page, this.pageSize).subscribe({
      next: (data) => {
        this.clients = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        this.result = true;
      },
      error: (err) => {
        this.notification.showError('Erreur de chargement des clients');
        this.isLoading = false;
        this.result = true;
      }
    });
  }

  openModal(client?: ClientNumexis): void {
    this.selectedClient = client || null;
    this.clientForm.reset();
    if (client) {
      this.clientForm.patchValue(client);
    }
    this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.clientForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const clientData = this.clientForm.value;
    const action$ = clientData.id
      ? this.clientNumexisService.update(clientData.id, clientData)
      : this.clientNumexisService.create(clientData);

    action$.subscribe({
      next: () => {
        const msg = clientData.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`Client ${msg} avec succès`);
        this.loadClients();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(err.error.message || 'Une erreur est survenue');
      }
    });
  }

  deleteClient(client: ClientNumexis): void {
    Swal.fire({
      title: 'Supprimer le client',
      text: `Êtes-vous sûr de vouloir supprimer le client ${client.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientNumexisService.delete(client.id).subscribe({
          next: () => {
            this.notification.showSuccess('Client supprimé avec succès');
            this.loadClients();
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
    this.loadClients(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
