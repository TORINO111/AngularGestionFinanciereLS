import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    standalone: false
})
export class ConfirmComponent implements OnInit {

  formSubmitted: boolean = false;
  resetPasswordForm:UntypedFormGroup;
  token = '';
  constructor (private authenticationService:AuthenticationService,
    private titleService: Title,private route: ActivatedRoute,private _route:Router,
    private fb: UntypedFormBuilder,private toastr: ToastrService) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmation: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.titleService.setTitle("Confirm Password | GESTION FINANCIERE");
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  /**
 * convenience getter for easy access to form fields
 */
  get formValues() {
    return this.resetPasswordForm.controls;
  }

  resetPassword() {
    this.formSubmitted = true;
    console.log(this.resetPasswordForm.value)
    if (!this.resetPasswordForm.valid) {
      this.showWarning('Formulaire invalide');
      return;
    }
    if (!(this.resetPasswordForm.value.password===this.resetPasswordForm.value.confirmation)) {
      this.showWarning('Mot de passe et confirmation ne sont pas identiques');
      return;
    }
    this.authenticationService.renouvelerMotDePasse( {
      token: this.token,
      newPassword: this.resetPasswordForm.value.password
    }).subscribe({
      next: () =>{
        //alert("Mot de passe modifié")
        this.showSuccess('Mot de passe modifié');
        this._route.navigate(['auth/login']);
      } ,
      error: (err:any) =>{
       // alert(err.error.message)
       this.showError('Erreur serveur')
      }
    });
  }

  showSuccess(message: string){
    this.toastr.success(message+'!', 'Success', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar:true,
      closeButton: true
    });
  }
  
  showError(message: string){
    this.toastr.error(message+'!', 'Error', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar:true,
      closeButton: true
    });
  }

  showWarning(message: string){
    this.toastr.warning(message+'!', 'Warning', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar:true,
      closeButton: true
    });
  }
}
