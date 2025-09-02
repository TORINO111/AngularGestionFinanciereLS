import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  standalone: false
})
export class SetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  token: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      token: ['', Validators.required],
      civilite: ['', Validators.required],
      prenom: ['', [Validators.required, this.lettersAndAccentsValidator]],
      nom: ['', [Validators.required, this.lettersAndAccentsValidator]],
      username: ['', [Validators.required, this.usernameValidator]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.token = params['token']; 
    //   if (this.token) {
    //     this.http.get<any>(`${environment.apiUrl}/api/auth/superviseur-by-token?token=${this.token}`)
    //       .subscribe({
    //         next: (userData: any) => {
    //           this.passwordForm.patchValue(userData);
    //           //this.passwordForm.get('email')?.disable();
    //         },
    //         error: (error: any) => {
    //           this.errorMessage = error.error; 
    //         }
    //       });
    //   } else {
    //     this.errorMessage = "Jeton d'activation manquant. Veuillez utiliser le lien fourni dans l'e-mail.";
    //   }
    // });
  }

  private usernameValidator = (control: AbstractControl): ValidationErrors | null => {
    // Permet les lettres, les chiffres et les espaces
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (control.value && !pattern.test(control.value)) {
      return { 'usernameInvalid': true };
    }
    return null;
  };

  private lettersAndAccentsValidator = (control: AbstractControl): ValidationErrors | null => {
    // Permet les lettres, les tirets, les espaces et les accents et exlue les chiffres
    const pattern = /^[a-zA-Z\u00C0-\u017F\s-]*$/;
    if (control.value && !pattern.test(control.value)) {
      // Si la valeur contient des chiffres, renvoie une erreur spécifique
      if (/\d/.test(control.value)) {
        return { 'containsDigits': true };
      }
      // Sinon, renvoie une autre erreur pour les autres caractères non autorisés
      return { 'lettersAndAccents': true };
    }
    return null;
  };

  private passwordMatchValidator = (group: FormGroup): ValidationErrors | null => {
    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) {
      return null;
    }

    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { 'mismatch': true };
    }
    return null;
  };

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const formData = this.passwordForm.getRawValue();

    this.http.post(`${environment.apiUrl}/api/auth/set-password`, formData, {
      observe: 'response',
      responseType: 'json'
    }).subscribe({
      next: resp => {
        const body: any = resp.body;
        this.successMessage = body?.message || 'Opération réussie.';
        this.errorMessage = '';
        // reset des erreurs du formulaire
        this.passwordForm.setErrors(null);
        Object.keys(this.passwordForm.controls).forEach(field => {
          this.passwordForm.get(field)?.setErrors(null);
        });
        this.router.navigate(['auth/login']); 
      },
      //HttpResponse
      error: (err: HttpErrorResponse) => {
        console.log("==== ERREUR BRUTE ====");
        console.log("err :", err);
        this.errorMessage = JSON.stringify(err);
        console.log("err.message :", err.message);
        console.log("err.status :", err.status);
        console.log("err.statusText :", err.statusText);
        console.log("err.error?.text :", (err.error as any)?.text);
        try {
          const jsonTest = JSON.parse((err.error as any)?.text || "{}");
          console.log("JSON.parse(err.error.text) =>", jsonTest);
        } catch (e) {
          console.log("Impossible de parser err.error.text");
        }
      }

    });
  }

}