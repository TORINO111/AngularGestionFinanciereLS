import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  ControlEvent,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/core/service/auth.service";
import { Role } from "src/app/models/utilisateur.model";
import { ExerciceComptableService } from "src/app/services/exercices-comptables/exercice-comptable.service";
import { SocieteSelectionService } from "src/app/services/societe-selection/societe-selection.service";
import { SocieteService } from "src/app/services/societe/societe.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  returnUrl: string = "/traitements/saisies-recettes";
  loginForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  error: string = "";

  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private societeSelectionService: SocieteSelectionService,
    private societeService: SocieteService,
    private exerciceService: ExerciceComptableService
  ) {
    titleService.setTitle("Log In | GESTION FINANCIERE");
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
      // username: ['chloe', [Validators.required]],
      // password: ['1234', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();
    this.societeSelectionService.clearSociete();

    // get return url from route parameters or default to '/'

    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] ||
      "/traitements/saisies-recettes";
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    //console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService
        .login(this.loginForm.value)
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            const body = data.body;
            const token = body.token;
            const refreshToken = body.refreshToken;

            let jwt = data.headers.get("Authorization");
            this.authenticationService.saveTokens(token, refreshToken);

            this.authenticationService
              .getUserByUsername(this.loginForm.value.username)
              .subscribe((data: any) => {
                sessionStorage.setItem("user", JSON.stringify(data));
                sessionStorage.setItem("currentUser", JSON.stringify(data));
                const userRole = data.role;
                sessionStorage.setItem("role", userRole);

                this.handleLoginSuccess(data);
              });
          },
          error: (error: any) => {
            const details = error.error?.details;
            const message = error.error?.message;

            if (details?.includes("Compte inactif")) {
              this.error =
                "Compte inactif, merci de contacter l'administrateur.";
            } else {
              this.error = details || message || "Erreur inconnue.";
            }

            this.loading = false;
          },
        });
    } else {
      this.loading = false;
      this.error = "Formulaire invalide";
    }
  }

  private handleLoginSuccess(user: any) {
    //Load de la société pour l'utilisateur connecté
    if (
      user.role === Role.ENTREPRISE_USER ||
      user.role === Role.ENTREPRISE_ADMIN
    ) {
      this.loadSocieteForUser(user);
    } else {
      this.gestionRedirection(user.role);
    }
  }

  private gestionRedirection(role: string) {
    switch (role) {
      case "ADMIN":
        this.returnUrl = "/parametrages/utilisateurs";
        this.router.navigate([this.returnUrl]);
        break;
      case "CLIENT_ADMIN":
        this.returnUrl = "/parametrages/cohortes";
        this.router.navigate([this.returnUrl]);
        break;
      case "CLIENT_AGENT":
        this.returnUrl = "/parametrages/cohortes";
        this.router.navigate([this.returnUrl]);
        break;
      case "BAILLEUR":
        this.returnUrl = "/parametrages/cohortes";
        this.router.navigate([this.returnUrl]);
        break;
      case "ENTREPRISE_ADMIN":
        this.returnUrl = "/parametrages/utilisateurs";
        this.router.navigate([this.returnUrl]);
        break;
      case "ENTREPRISE_USER":
        this.returnUrl = "/parametrages/operations";
        this.router.navigate([this.returnUrl]);
        break;
      default:
        this.returnUrl = "/";
        this.router.navigate([this.returnUrl]);
        break;
    }
  }

  private loadSocieteForUser(user: any) {
    this.societeService
      .getSocietePourUserConnecte(user!.id)
      .subscribe((societe) => {
        sessionStorage.setItem("societeActive", JSON.stringify(societe));
        this.loadExerciceForSociete(societe, user.role);
      });
  }

  private loadExerciceForSociete(societe: any, role: string) {
    this.exerciceService.getExerciceEnCoursBySociete(societe.id).subscribe({
      next: (data) => {
        sessionStorage.setItem("exerciceEnCours", JSON.stringify(data));

         this.gestionRedirection(role);
      },
      error: (err) => {
        localStorage.removeItem("exerciceEnCours");
        console.log(
          err.error.message || "Erreur lors du chargement de l'exercice"
        );
      },
    });
  }
}
