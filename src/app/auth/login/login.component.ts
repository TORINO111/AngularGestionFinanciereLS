import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ControlEvent } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { SocieteSelectionService } from 'src/app/services/societe-selection/societe-selection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string = '/traitements/saisies-recettes';
  loginForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private societeSelectionService: SocieteSelectionService
  ) {
    titleService.setTitle("Log In | GESTION FINANCIERE")
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
      // username: ['chloe', [Validators.required]],
      // password: ['1234', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();
    this.societeSelectionService.clearSociete();


    // get return url from route parameters or default to '/'

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traitements/saisies-recettes';

  }

  /**
  * convenience getter for easy access to form fields
  */
  get formValues() { return this.loginForm.controls; }

  //   onSubmit(): void {
  //   this.formSubmitted = true;
  //   this.error = '';
  //   console.log('Form submitted with values:', this.loginForm.value);

  //   if (!this.loginForm.valid) {
  //     this.error = 'Formulaire invalide';
  //     console.log('Formulaire invalide');
  //     return;
  //   }

  //   this.loading = true;

  //   this.authenticationService.login(this.loginForm.value)
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('Réponse complète du login:', response);

  //         let jwt = response.headers.get('Authorization');
  //         console.log('Token dans le header Authorization:', jwt);

  //         if (!jwt) {
  //           this.error = 'Impossible de récupérer le token';
  //           this.loading = false;
  //           return;
  //         }

  //         // Retirer le préfixe "Bearer " si présent
  //         jwt = jwt.startsWith('Bearer ') ? jwt.slice(7) : jwt;
  //         console.log('Token après nettoyage du préfixe Bearer:', jwt);

  //         // Sauvegarde le token et décode les rôles
  //         this.authenticationService.saveToken(jwt);

  //         console.log('Token sauvegardé dans localStorage:', localStorage.getItem('token'));
  //         console.log('Roles sauvegardés:', sessionStorage.getItem('roles'));

  //         // Récupérer les infos utilisateur
  //         this.authenticationService.getUserByUsername(this.loginForm.value.username)
  //           .subscribe({
  //             next: (userData: any) => {
  //               console.log('Données utilisateur récupérées:', userData);

  //               if (!userData.enabled) {
  //                 this.error = 'Compte inactif, merci de contacter l\'administrateur';
  //                 this.loading = false;
  //                 this.router.navigate(['/auth/signin']);
  //                 return;
  //               }

  //               localStorage.setItem('user', JSON.stringify(userData));
  //               sessionStorage.setItem('currentUser', JSON.stringify(userData));

  //               if (this.authenticationService.isAdmin()) {
  //                 this.returnUrl = '/parametrages/cabinets';
  //               } else if (this.authenticationService.isSuperviseur()) {
  //                 this.returnUrl = '/superviseur/dashboard';
  //               } else if (this.authenticationService.isComptable()) {
  //                 this.returnUrl = '/comptable/dashboard';
  //               } else {
  //                 this.returnUrl = '/';
  //               }

  //               console.log('Redirection vers :', this.returnUrl);
  //               this.router.navigate([this.returnUrl]);
  //               this.loading = false;
  //             },
  //             error: (err) => {
  //               console.error('Erreur lors de la récupération des infos utilisateur:', err);
  //               this.error = 'Impossible de récupérer les informations utilisateur';
  //               this.loading = false;
  //             }
  //           });
  //       },
  //       error: (err) => {
  //         console.error('Erreur login:', err);
  //         if (err.status === 401) {
  //           this.error = 'Username ou mot de passe incorrect';
  //         } else {
  //           this.error = 'Erreur serveur';
  //         }
  //         this.loading = false;
  //       }
  //     });
  // }

  onSubmit(): void {
    this.formSubmitted = true;
    //console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value)
        .pipe(first())
        .subscribe(
          {
            next: (data: any) => {
              const body = data.body;
              const token = body.token;
              const refreshToken = body.refreshToken;

              let jwt = data.headers.get('Authorization');
              this.authenticationService.saveTokens(token, refreshToken);
              this.authenticationService.getUserByUsername(this.loginForm.value.username).subscribe((data: any) => {
                if (!data.enabled) {
                  this.error = 'Compte inactif, Merci de contacter l\'administrateur';
                  this.loading = false;
                  this.router.navigate(['/auth/signin']);
                } else {
                  if (this.authenticationService.isAdmin()) {
                    this.returnUrl = '/parametrages/operations';
                  }
                  localStorage.setItem("user", JSON.stringify(data));
                  sessionStorage.setItem("currentUser", JSON.stringify(data));
                  this.router.navigate([this.returnUrl]);
                }

              });

            },
            error: (error: any) => {
              //this.error = error;
              this.error = 'Username ou mot de passe incorrect';
              this.loading = false;
            }
          });
    } else {
      this.loading = false;
      this.error = 'Formulaire invalide';
    }
  }

}
