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

  constructor (
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



  onSubmit(): void {
    this.formSubmitted = true;
    //console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value)
        .pipe(first())
        .subscribe(
          {
          next:(data: any) => {

            let jwt=data.headers.get('Authorization');
            this.authenticationService.saveToken(jwt);
            this.authenticationService.getUserByUsername(this.loginForm.value.username).subscribe((data:any)=>{
              if(!data.enabled){
                this.error='Compte inactif,Merci de contacter l\'administrateur';
                this.loading=false;
                this.router.navigate(['/auth/signin']);
              }else{
                if(this.authenticationService.isAdmin()){
                  this.returnUrl='/parametrages/cabinets';
                }
                localStorage.setItem("user", JSON.stringify(data));
                sessionStorage.setItem("currentUser", JSON.stringify(data));
                console.log('Redirection vers :', this.returnUrl);
                this.router.navigate([this.returnUrl]); 
              }
              
            });
            
          },
          error:(error: any) => {
            //this.error = error;
            this.error='Username ou mot de passe incorrect';
            this.loading = false;
          }
        });
    }else{
      this.loading=false;
      this.error='Formulaire invalide';
    }
  }
}
