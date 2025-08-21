import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
    selector: 'app-lock-screen',
    templateUrl: './lock-screen.component.html',
    styleUrls: ['./lock-screen.component.scss'],
    standalone: false
})
export class LockScreenComponent implements OnInit {

  lockScreenForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  constructor (
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: UntypedFormBuilder,
    private titleService: Title
  ) {
    titleService.setTitle("Lock Screen | GESTION FINANCIERE")
  }

  ngOnInit(): void {
    this.lockScreenForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
 * convenience getter for easy access to form fields
 */
  get formValues() {
    return this.lockScreenForm.controls;
  }



  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    // if (this.lockScreenForm.valid) {
    //   this.authenticationService.login(this.authenticationService.currentUser()?.email!, this.formValues.password?.value)
    //     .pipe(first())
    //     .subscribe(
    //       (data: any) => {
    //         this.router.navigate(['/dashboard/ecommerce']);
    //       },
    //       (error: any) => {
    //         this.error = error;
    //       });
    // }
  }

}
