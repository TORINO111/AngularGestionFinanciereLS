import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, switchMap, tap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientNumexisService } from "src/app/services/clients-numexis/client-numexis.service";
import {
  ClientNumexis,
  TypeClientNumexis,
} from "src/app/models/client-numexis.model";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import Swal from "sweetalert2";
import { LocationService } from "src/app/services/composite/locations/location.service";

@Component({
  selector: "app-clients-numexis",
  templateUrl: "./clients-numexis.component.html",
  styleUrls: ["./clients-numexis.component.scss"],
  standalone: false,
})
export class ClientsNumexisComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;

  pageTitle: BreadcrumbItem[] = [];
  clients: ClientNumexis[] = [];
  clientForm: FormGroup;
  selectedClient: ClientNumexis | null = null;
  isLoading = false;
  result = false;

  searchTerm: string = "";
  searchTelephone: string = "";
  selectedPays?: string;
  selectedVille?: string;
  selectedType?: TypeClientNumexis;

  private search$ = new Subject<void>();

  typesClientNumexis = Object.values(TypeClientNumexis);
  countries: any[] = [];
  cities: string[] = [];

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  userBi: any;

  constructor(
    private clientNumexisService: ClientNumexisService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private locationService: LocationService,
    private notification: NotificationService
  ) {
    this.clientForm = this.fb.group({
      id: [null],
      nom: ["", Validators.required],
      sigle: [""],
      telephone: [""],
      email: ["", Validators.email],
      adresse: [""],
      numeroRccm: [""],
      numeroIFU: [""],
      ville: [{ value: "", disabled: true }, Validators.required],
      pays: ["", Validators.required],
      typeClientNumexis: ["", Validators.required],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Clients Numexis", path: "/", active: true }];
    const userActive = sessionStorage.getItem("user");

    if (userActive) {
      this.userBi = JSON.parse(userActive);
    }

    this.loadClients();
    this.loadCountries();
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
          return this.clientNumexisService.getAllPageable(
            0,
            this.pageSize,
            this.searchTerm || undefined,
            this.searchTelephone || undefined,
            this.selectedVille || undefined,
            this.selectedPays || undefined,
            this.selectedType || undefined
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.clients = data.content;
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

  loadCountries(): void {
    this.locationService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  onCountryChange(selectedCountry: any): void {
  this.selectedVille = undefined;

  const countryName = selectedCountry?.name || this.selectedPays;
  const villeControl = this.clientForm.get('ville');

  if (countryName) {
    this.locationService.getCitiesByCountry(countryName).subscribe((cities) => {
      this.cities = cities || [];

      // Active le contrôle seulement s'il y a des villes
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

  loadClients(page: number = 0): void {
    this.isLoading = true;
    this.result = false;
    this.currentPage = page;
    this.clientNumexisService
      .getAllPageable(
        page,
        this.pageSize,
        this.searchTerm || undefined,
        this.searchTelephone || undefined,
        this.selectedVille || undefined,
        this.selectedPays || undefined,
        this.selectedType || undefined
      )
      .subscribe({
        next: (data) => {
          this.clients = data.content;
          this.totalElements = data.totalElements;
          this.isLoading = false;
          this.result = true;
        },
        error: (err) => {
          this.notification.showError("Erreur de chargement des clients");
          this.isLoading = false;
          this.result = true;
        },
      });
  }

  openModal(client?: ClientNumexis): void {
    this.selectedClient = client || null;
    this.clientForm.reset();
    if (client) {
      this.clientForm.patchValue({
        id: client.id,
        nom: client.nom,
        sigle: client.sigle,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse,
        numeroRccm: client.numeroRccm,
        numeroIFU: client.numeroIFU,
        typeClientNumexis: client.typeClientNumexis,
        pays: client.pays,
        userId: this.userBi.id
      });

      if (client.pays) {
        this.locationService
          .getCitiesByCountry(client.pays)
          .subscribe((cities) => {
            this.cities = cities;
            this.clientForm.get("ville")?.enable();
            this.clientForm.get("ville")?.setValue(client.ville);
          });
      }
    }
    this.modalService.open(this.modalContent, { centered: true, size: "lg" });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  enregistrer(): void {
    if (this.clientForm.invalid) {
      this.notification.showWarning("Formulaire invalide");
      return;
    }

    const clientData = this.clientForm.getRawValue();
    const action$ = clientData.id
      ? this.clientNumexisService.update(clientData.id, clientData)
      : this.clientNumexisService.create(clientData);

    action$.subscribe({
      next: () => {
        const msg = clientData.id ? "Modifié" : "Enregistré";
        this.notification.showSuccess(`Client ${msg} avec succès`);
        this.loadClients();
        this.closeModal();
      },
      error: (err) => {
        this.notification.showError(
          err.error.message || "Une erreur est survenue"
        );
      },
    });
  }

  deleteClient(client: ClientNumexis): void {
    Swal.fire({
      title: "Supprimer le client",
      text: `Êtes-vous sûr de vouloir supprimer le client ${client.nom} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientNumexisService.delete(client.id).subscribe({
          next: () => {
            this.notification.showSuccess("Client supprimé avec succès");
            this.loadClients();
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
    this.loadClients(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
