import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { Societe } from 'src/app/models/societe.model';
import { UtilisateurService } from 'src/app/services/utilisateurs/utilisateur.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { LocationService } from 'src/app/services/composite/locations/location.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-societes',
    templateUrl: './societes.component.html',
    styleUrls: ['./societes.component.scss'],
    standalone: false
})
export class SocietesComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  societeForm!: FormGroup;
  pageTitle: BreadcrumbItem[] = [];

  societesList: Societe[] = [];
  selectedSociete: Societe | null = null;

  isLoading = false;
  result = false;
  
  user: any;
  canAlter: boolean = false;

  searchTerm: string = '';
  searchTelephone: string = '';
  selectedPays?: string;
  selectedVille?: string;

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  
  countries: any[] = [];
  cities: string[] = [];
  
  private search$ = new Subject<void>();

  constructor(
    private societeService: SocieteService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private notification: NotificationService,
    private locationService: LocationService
  ) {
    this.societeForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      telephone: [],
      email: ['', Validators.email],
      adresse:[],
      numeroIFU: [],
      pays: ['', Validators.required],
      ville: [{ value: '', disabled: true }, Validators.required],
      comptableId: [],
    });
    const userJson = localStorage.getItem('user');
    this.user = userJson ? JSON.parse(userJson) : null;
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Sociétés', path: '/', active: true }];
    if (this.user && (this.user.role === 'SUPERVISEUR' || this.user.role === 'BAILLEUR' || this.user.role === 'ADMIN' || this.user.role === 'CLIENT_ADMIN' || this.user.role === 'CLIENT_COMPTABLE')) {
      this.canAlter = true;
    }
    this.loadSocietes();
    this.loadCountries();
    this.initSearchListener();
  }

  loadSocietes(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    // Assuming a paginated service method exists, similar to other components
    this.societeService.getAllSocietePageable(
      page,
      this.pageSize,
      this.searchTerm || undefined,
      this.searchTelephone || undefined,
      this.selectedVille || undefined,
      this.selectedPays || undefined
    ).subscribe({
      next: (data) => {
        this.societesList = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        this.result = true;
      },
      error: (err) => {
        this.notification.showError("Erreur de chargement des sociétés");
        this.isLoading = false;
        this.result = true;
      },
    });
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
          return this.societeService.getAllSocietePageable(
            0,
            this.pageSize,
            this.searchTerm || undefined,
            this.searchTelephone || undefined,
            this.selectedVille || undefined,
            this.selectedPays || undefined
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.societesList = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error("Erreur lors de la recherche", err);
        },
      });
  }

  onFilterChange(): void {
    this.search$.next();
  }

  loadCountries(): void {
    this.locationService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  onCountryChange(selectedCountry: any): void {
    this.selectedVille = undefined;
    const countryName = selectedCountry?.name || this.selectedPays;
    const villeControl = this.societeForm.get('ville');

    if (countryName) {
      this.locationService.getCitiesByCountry(countryName).subscribe((cities) => {
        this.cities = cities || [];
        if (this.cities.length > 0) {
          villeControl?.enable();
        } else {
          villeControl?.disable();
        }
      });
    } else {
      this.cities = [];
      villeControl?.disable();
    }
    this.onFilterChange();
  }

  onFilterCountryChange(): void {
    this.selectedVille = undefined;
    if (this.selectedPays) {
      this.locationService
        .getCitiesByCountry(this.selectedPays)
        .subscribe((cities) => {
          this.cities = cities;
        });
    } else {
      this.cities = [];
    }
    this.onFilterChange();
  }

  openModal(societe?: Societe): void {
    this.selectedSociete = societe || null;
    this.societeForm.reset();
    if (societe) {
      this.societeForm.patchValue(societe);
      if (societe.paysNom) {
        this.locationService
          .getCitiesByCountry(societe.paysNom)
          .subscribe((cities) => {
            this.cities = cities;
            this.societeForm.get("ville")?.enable();
            this.societeForm.get("ville")?.setValue(societe.ville);
          });
      }
    }
    this.modalService.open(this.modalContent, { centered: true, size: 'lg' });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.societeForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const societeData = this.societeForm.getRawValue();
    const action$ = societeData.id
      ? this.societeService.updateSociete(societeData.id, societeData)
      : this.societeService.createSociete(societeData);

    action$.subscribe({
      next: () => {
        const msg = societeData.id ? 'Modifiée' : 'Enregistrée';
        this.notification.showSuccess(`Société ${msg} avec succès`);
        this.loadSocietes();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(err.error.message || 'Une erreur est survenue');
      }
    });
  }

  deleteSociete(societe: Societe): void {
    Swal.fire({
      title: 'Supprimer la société',
      text: `Êtes-vous sûr de vouloir supprimer la société ${societe.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.societeService.deleteSociete(societe.id!).subscribe({
          next: () => {
            this.notification.showSuccess('Société supprimée avec succès');
            this.loadSocietes();
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
    this.loadSocietes(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}