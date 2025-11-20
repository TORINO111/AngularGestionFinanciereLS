import { UtilisateurService } from "./../../../services/utilisateurs/utilisateur.service";
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { SocieteService } from "src/app/services/societe/societe.service";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import { debounceTime, Subject, switchMap, tap } from "rxjs";
import { Utilisateur } from "src/app/models/utilisateur.model";
import { ClientNumexisService } from "src/app/services/clients-numexis/client-numexis.service";
import { BailleurService } from "src/app/services/bailleurs/bailleur.service";
import { ClientNumexis } from "src/app/models/client-numexis.model";
import { Bailleur } from "src/app/models/bailleur.model";
import { ControlesFormulairesService } from "src/app/services/composite/controles-formulaires/controles-formulaires.service";
@Component({
  selector: "app-utilisateurs",
  templateUrl: "./utilisateurs.component.html",
  styleUrls: ["./utilisateurs.component.scss"],
  standalone: false,
})
export class UtilisateursComponent implements OnInit {
  @ViewChild("content", { static: true }) content: TemplateRef<any>;
  @ViewChild("editcontent", { static: true }) editcontent: any;

  closeResult: string = "";
  pageTitle: BreadcrumbItem[] = [];
  subtitle: string;
  utilisateurForm: UntypedFormGroup;
  saveSuccess = false;
  saveFail = false;
  loading = false;
  isOpen = false;
  users: any[] = [];
  roles: any[] = [];
  superviseurs: any[] = [];
  admin = false;
  societes: any[] = [];
  clientsNumexis: ClientNumexis[] = [];
  bailleurs: Bailleur[] = [];
  idAdmin: number;
  user: any;

  result = false;
  isLoading = false;
  searchNom: string = "";
  searchPrenom: string = "";
  searchUsername: string = "";
  selectedRole: string | null = null;

  selectedRoleForModal: string | null = null;
  selectedUser: Utilisateur | null = null;
  civiliteOptions: string[] = ["HOMME", "FEMME"];

  roleUser: string = "";

  private search$ = new Subject<{
    nom: string;
    prenom: string;
    username: string;
    role: string | null;
  }>();

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  modifUser: boolean = false;
  userBi: any;
  societeBi: any;
  isEntrepriseAdmin: boolean = false;

  constructor(
    private societeService: SocieteService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private notification: NotificationService,
    private utilisateurService: UtilisateurService,
    private clientNumexisService: ClientNumexisService,
    public controleForm: ControlesFormulairesService,
    private bailleurService: BailleurService
  ) {
    const userJson = localStorage.getItem("user");
    this.user = userJson ? JSON.parse(userJson) : null;

    this.utilisateurForm = this.fb.group({
      id: [],
      username: ["", [Validators.required, Validators.minLength(2)]],
      nom: ["", [Validators.required, Validators.minLength(2)]],
      prenom: ["", Validators.required],
      email: ["", [Validators.email]],
      password: [""],
      enabled: [],
      role: ["", Validators.required],
      societeId: [null],
      clientNumexisId: [null],
      bailleurId: [null],
      telephone: ["", Validators.required],
      civilite: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "utilisateurs", path: "/", active: true }];

    const userActive = localStorage.getItem("user");

    if (userActive) {
      this.userBi = JSON.parse(userActive);
      this.roleUser = this.userBi.role;
    }

    switch (this.roleUser) {
      case "ENTREPRISE_ADMIN":
        this.isEntrepriseAdmin = true;
        break;
      case "ADMIN":
        this.loadClientsNumexis();
        this.loadBailleurs();
        break;
    }

    this.loadUsersByRole();
    this.loadSocietes();
    this.chargerRoles();

    this.initSearchListener();
  }

  private loadSocietes(): void {
    this.societeService.getAllSociete().subscribe({
      next: (data: any[]) => {
        this.societes = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des sociétés", err);
      },
    });
  }

  private loadClientsNumexis(): void {
    this.clientNumexisService.getAll().subscribe({
      next: (data: ClientNumexis[]) => {
        this.clientsNumexis = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des clients Numexis", err);
      },
    });
  }

  private loadBailleurs(): void {
    this.bailleurService.getAll().subscribe({
      next: (data: Bailleur[]) => {
        this.bailleurs = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des bailleurs", err);
      },
    });
  }

  chargerRoles() {
    this.utilisateurService.allRoles().subscribe(
      (data: any[]) => {
        let roles: any[] = data as any[];

        if (this.isEntrepriseAdmin) {
          roles = roles.filter((r) =>
            ["ENTREPRISE_ADMIN", "ENTREPRISE_USER"].includes(r)
          );
        }
        this.roles = roles;
        this.result = true;
      },
      (err) => {
        this.result = true;
        this.notification.showError(
          err.error.message || "Erreur lors du chargement des rôles."
        );
      }
    );
  }

  enregistrer(): void {
    if (this.utilisateurForm.invalid) {
      this.notification.showWarning("Formulaire invalide");
      return;
    }

    const utilisateur = this.utilisateurForm.getRawValue();
    console.log("Utilisateur à enregistrer/modifier :", utilisateur);
    const action$ = utilisateur?.id
      ? this.utilisateurService.updateUtilisateur(utilisateur.id, utilisateur)
      : this.utilisateurService.addUser(utilisateur);

    action$.subscribe({
      next: () => {
        this.loading = true;
        this.loadUsersByRole();
        this.modalService.dismissAll();
        this.loading = false;

        const msg = utilisateur?.id ? "Modifié" : "Enregistré";
        this.notification.showSuccess(`${msg} avec succès`);
        this.selectedUser = null;
      },
      error: (err) => {
        this.notification.showError(
          err.error.message || "Une erreur est survenue"
        );
      },
    });
  }

  loadUsersByRole(page: number = 0): void {
    this.result = false;
    this.isLoading = true;
    this.currentPage = page;

    const obs$ =
      this.roleUser === "ADMIN"
        ? this.utilisateurService.getAllPageable(
            page,
            this.pageSize,
            this.searchUsername || undefined,
            this.searchNom || undefined,
            this.searchPrenom || undefined,
            this.selectedRole || undefined
          )
        : ["ENTREPRISE_ADMIN", "ENTREPRISE_USER"].includes(this.roleUser)
        ? this.utilisateurService.getUsersBySocieteIdPageable(
            this.userBi.societeId,
            page,
            this.pageSize,
            this.searchUsername || undefined,
            this.searchNom || undefined,
            this.searchPrenom || undefined,
            this.selectedRole || undefined
          )
        : null;

    if (!obs$) {
      this.result = true;
      this.isLoading = false;
      return;
    }

    obs$.subscribe({
      next: (data: any) => {
        this.users = data.content;
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.result = true;
        this.isLoading = false;
        this.notification.showError(
          err.error?.message || "Erreur lors du chargement des utilisateurs."
        );
      },
    });
  }

  onFilterChange(): void {
    this.search$.next({
      nom: this.searchNom,
      prenom: this.searchPrenom,
      username: this.searchUsername,
      role: this.selectedRole,
    });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(({ nom, prenom, username, role }) => {
          this.currentPage = 0;

          // ADMIN → recherche globale
          if (this.roleUser === "ADMIN") {
            return this.utilisateurService.getAllPageable(
              0,
              this.pageSize,
              username || undefined,
              nom || undefined,
              prenom || undefined,
              role || undefined
            );
          }

          // ENTREPRISE_ADMIN → recherche dans la société
          if (this.roleUser === "ENTREPRISE_ADMIN") {
            return this.utilisateurService.getUsersBySocieteIdPageable(
              this.userBi.societeId,
              0,
              this.pageSize,
              username || undefined,
              nom || undefined,
              prenom || undefined,
              role || undefined
            );
          }

          return this.utilisateurService.getAllPageable(0, this.pageSize);
        })
      )
      .subscribe({
        next: (data) => {
          this.users = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur lors de la recherche", err);
          this.isLoading = false;
        },
      });
  }

  pages(): number[] {
    return Array(this.totalPages())
      .fill(0)
      .map((_, i) => i);
  }

  goToPage(page: number = 0) {
    this.loadUsersByRole(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  showConfirmationSwal(
    title: string,
    text: string,
    confirmText: string,
    onConfirm: () => void
  ) {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      cancelButtonText: "Non",
    }).then((result: any) => {
      if (result.value) {
        onConfirm();
      }
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire("Abandonné", `${title.toLowerCase()} annulée`, "error");
      // }
    });
  }

  deleteUser(id: number) {
    this.showConfirmationSwal(
      "Etes-vous sûr ?",
      "Cette action est irréversible !",
      "Oui, Supprimer !",
      () => {
        this.utilisateurService.deleteUser(id).subscribe(
          (res) => {
            if (res != null) {
              this.loadUsersByRole();
              Swal.fire("Supprimé!", "Utilisateur supprimé.", "success");
            } else {
              Swal.fire("Erreur", "Utilisateur non supprimé.", "error");
            }
          },
          () => Swal.fire("Erreur", "Utilisateur non supprimé.", "error")
        );
      }
    );
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.modalService
      .open(content, {
        size: "lg", // set modal size
        centered: true,
        scrollable: true,
        backdrop: "static", // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: "modal-basic-title",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openModal(user?: Utilisateur): void {
    this.modifUser = false;
    this.selectedUser = user || null;
    this.utilisateurForm.reset();
    this.selectedRoleForModal = "";

    if (user) {
      this.utilisateurForm.patchValue(user);
      if (user.role) {
        const roleObject = this.roles.find((r) => r === user.role);
        if (roleObject) {
          this.utilisateurForm.get("idRole")?.patchValue(roleObject.id);
          this.onRoleChangeForModal(roleObject);
        }
      }
      if (user.societeId)
        this.utilisateurForm.get("societeId")?.patchValue(user.societeId);
      if (user.clientNumexisId)
        this.utilisateurForm
          .get("clientNumexisId")
          ?.patchValue(user.clientNumexisId);
      if (user.bailleurId)
        this.utilisateurForm.get("bailleurId")?.patchValue(user.bailleurId);
      if (user.telephone)
        this.utilisateurForm.get("telephone")?.patchValue(user.telephone);
      if (user.civilite)
        this.utilisateurForm.get("civilite")?.patchValue(user.civilite);
    } else {
      this.modifUser = true;
      this.onRoleChangeForModal(null);
    }
    this.modalService.open(this.content, { size: "lg", centered: true });
  }

  onRoleChangeForModal(role: any): void {
    this.selectedRoleForModal = role ? role : "";

    this.utilisateurForm.get("clientNumexisId")?.disable();
    this.utilisateurForm.get("bailleurId")?.disable();
    this.utilisateurForm.get("societeId")?.patchValue(null);
    this.utilisateurForm.get("clientNumexisId")?.patchValue(null);
    this.utilisateurForm.get("bailleurId")?.patchValue(null);

    // Enable fields based on selected role
    switch (this.selectedRoleForModal) {
      case "ENTREPRISE_USER":
      case "ENTREPRISE_ADMIN":
          // L'utilisateur ne peut créer que des users liés à SA société si il est ENTREPRISE_ADMIN
          if(this.roleUser === "ENTREPRISE_ADMIN") {
            this.utilisateurForm.get("societeId")?.patchValue(this.userBi.societeId);
          } 
        break;
      case "CLIENT_COMPTABLE":
      case "CLIENT_ADMIN":
      case "CLIENT_AGENT":
        this.utilisateurForm.get("clientNumexisId")?.enable();
        break;
      case "BAILLEUR":
        this.utilisateurForm.get("bailleurId")?.enable();
        break;
      // case 'ADMIN':
      //   this.utilisateurForm.get('societeId')?.enable();
      //   this.utilisateurForm.get('clientNumexisId')?.enable();
      //   this.utilisateurForm.get('bailleurId')?.enable();
      //   break;
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return "with: ${reason}";
    }
  }
}
