import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BailleurService } from "src/app/services/bailleurs/bailleur.service";
import { Bailleur } from "src/app/models/bailleur.model";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import { ClientNumexisService } from "src/app/services/clients-numexis/client-numexis.service";
import { ClientNumexis } from "src/app/models/client-numexis.model";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { debounceTime, switchMap, tap } from "rxjs/operators";
import { LocationService } from "src/app/services/composite/locations/location.service";

@Component({
  selector: "app-bailleurs",
  templateUrl: "./bailleurs.component.html",
  styleUrls: ["./bailleurs.component.scss"],
  standalone: false,
})
export class BailleursComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;

  pageTitle: BreadcrumbItem[] = [];
  bailleurs: Bailleur[] = [];
  bailleurForm: FormGroup;
  selectedBailleur: Bailleur | null = null;
  isLoading = false;
  result = false;
  clientsNumexis: ClientNumexis[] = [];

  searchTerm: string = "";
  searchTelephone: string = "";
  selectedClientNumexisId?: number;
  selectedPays?: string;
  selectedVille?: string;

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  countries: any[];
  cities: string[];
  private search$ = new Subject<void>();
  user: any;
  canAlter: boolean = false;

  constructor(
    private bailleurService: BailleurService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notification: NotificationService,
    private clientNumexisService: ClientNumexisService,
    private locationService: LocationService
  ) {
    this.bailleurForm = this.fb.group({
      id: [null],
      nom: ["", Validators.required],
      telephone: [""],
      email: ["", Validators.email],
      adresse: [""],
      ville: [{ value: "", disabled: true }, Validators.required],
      pays: ["", Validators.required],
      clientNumexisId: [null, Validators.required],
    });
    const userJson = sessionStorage.getItem('user');
    this.user = userJson ? JSON.parse(userJson) : null;
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Bailleurs", path: "/", active: true }];
    if (this.user && (this.user.role === 'ADMIN' || this.user.role === 'CLIENT_ADMIN' || this.user.role === 'CLIENT_COMPTABLE')) {
      this.canAlter = true;
    }
    this.loadBailleurs();
    this.loadCountries();
    this.clientNumexisService.getAll().subscribe({
      next: (data) => {
        this.clientsNumexis = data;
      },
      error: (err) => {
        this.notification.showError("Erreur de chargement des clients Numexis");
      },
    });
    this.initSearchListener();
  }

  loadBailleurs(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    this.bailleurService.getAllPageable(
      page,
      this.pageSize,
      this.searchTerm || undefined,
      this.selectedClientNumexisId || undefined,
      this.searchTelephone || undefined,
      this.selectedPays || undefined,
      this.selectedVille || undefined
    ).subscribe({
      next: (data) => {
        this.bailleurs = data.content;
        this.totalElements = data.totalElements;
        this.isLoading = false;
        this.result = true;
      },
      error: (err) => {
        this.notification.showError("Erreur de chargement des bailleurs");
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
          return this.bailleurService.getAllPageable(
            0,
            this.pageSize,
            this.searchTerm || undefined,
            this.selectedClientNumexisId || undefined,
            this.searchTelephone || undefined,
            this.selectedPays || undefined,
            this.selectedVille || undefined
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.bailleurs = data.content;
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

  onFilterCountryChange(): void {
    this.selectedVille = undefined;
    if (this.selectedPays) {
      this.locationService
        .getCitiesByCountry(this.selectedPays)
        .subscribe((cities: string[]) => {
          this.cities = cities;
        });
    } else {
      this.cities = [];
    }
    this.onFilterChange();
  }

  onCountryChange(selectedCountry: any): void {
    this.selectedVille = undefined;

    const countryName = selectedCountry?.name || this.selectedPays;

    if (countryName) {
      this.locationService
        .getCitiesByCountry(countryName)
        .subscribe((cities) => {
          this.cities = cities || [];

          const villeControl = this.bailleurForm.get("ville");
          if (this.cities.length > 0) {
            villeControl?.enable();
          } else {
            villeControl?.disable();
          }
        });
    } else {
      this.cities = [];
      this.bailleurForm.get("ville")?.disable();
    }

    this.onFilterChange();
  }

  loadCountries(): void {
    this.locationService.getCountries().subscribe((countries: any[]) => {
      this.countries = countries;
    });
  }

  onFilterChange(): void {
    this.search$.next();
  }

  openModal(bailleur?: Bailleur): void {
    this.selectedBailleur = bailleur || null;
    this.bailleurForm.reset();
    if (bailleur) {
      this.bailleurForm.patchValue({
        id: bailleur.id,
        nom: bailleur.nom,
        telephone: bailleur.telephone,
        email: bailleur.email,
        adresse: bailleur.adresse,
        ville: bailleur.ville,
        pays: bailleur.pays,
        clientNumexisId: bailleur.clientNumexisId,
      });
    }
    this.modalService.open(this.modalContent, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.bailleurForm.invalid) {
      this.notification.showWarning("Formulaire invalide");
      return;
    }

    const bailleurData = this.bailleurForm.value;
    const selectedClient = this.clientsNumexis.find(
      (client) => client.id === bailleurData.clientNumexisId
    );
    if (selectedClient) {
      bailleurData.clientNumexisNom = selectedClient.nom;
    }
    const action$ = bailleurData.id
      ? this.bailleurService.update(bailleurData.id, bailleurData)
      : this.bailleurService.create(bailleurData);

    action$.subscribe({
      next: () => {
        const msg = bailleurData.id ? "Modifié" : "Enregistré";
        this.notification.showSuccess(`Bailleur ${msg} avec succès`);
        this.loadBailleurs();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(
          err.error.message || "Une erreur est survenue"
        );
      },
    });
  }

  deleteBailleur(bailleur: Bailleur): void {
    Swal.fire({
      title: "Supprimer le bailleur",
      text: `Êtes-vous sûr de vouloir supprimer le bailleur ${bailleur.nom} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.bailleurService.delete(bailleur.id).subscribe({
          next: () => {
            this.notification.showSuccess("Bailleur supprimé avec succès");
            this.loadBailleurs();
          },
          error: (err) => {
            this.notification.showError(
              err.error.message || "Une erreur est survenue"
            );
          },
        });
      }
    });
  }

  pages(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i);
  }

  goToPage(page: number) {
    this.loadBailleurs(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
