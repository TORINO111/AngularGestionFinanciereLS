import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signUpForm!: FormGroup;
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) {
    titleService.setTitle("Register | GESTION FINANCIERE")
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm.controls;
  }


  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.signUpForm.valid) {
      this.loading = true;
      this.authenticationService.signup(this.formValues.name?.value, this.formValues.email?.value, this.formValues.password?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            // navigates to confirm mail screen
            this.router.navigate(['/auth/confirm']);
          },
          (error: any) => {
            this.error = error;
            this.loading = false;
          });
    }
  }
}
