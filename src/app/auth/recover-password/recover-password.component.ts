import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss'],
    standalone: false
})
export class RecoverPasswordComponent implements OnInit {


  resetPasswordForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  successMessage: string = "";


  constructor (private authenticationService:AuthenticationService,
    private fb: UntypedFormBuilder, private titleService: Title,private toastr: ToastrService) {
    titleService.setTitle("Recover Password | GESTION FINANCIERE")
    this.resetPasswordForm = this.fb.group({
      telephone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      telephone: ['', [Validators.required]]
    });
  }

  /**
 * convenience getter for easy access to form fields
 */
  get formValues() {
    return this.resetPasswordForm.controls;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.resetPasswordForm.valid) {
      this.successMessage = "We have sent you an email containing a link to reset your password";
    }
  }

  sendLink() {
    this.formSubmitted = true;
    if (!this.resetPasswordForm.valid) {
      this.showWarning('Merci de renseigner votre numéro WhatsApp');
    }
    const telephone = this.resetPasswordForm.value.telephone;
    
    this.authenticationService.resetPasswordWhatsApp(telephone).subscribe({
      next: (res :any) => {
        const token = res.token;
        const encodedLink = encodeURIComponent(`Voici votre lien : http://localhost:8082/tresorerie/#/auth/confirm?token=${token}`);
        const fullPhone = telephone.replace('+', '').trim(); // Ex: +22670000000 => 22670000000
        const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedLink}`;
        window.open(whatsappUrl, '_blank');
        // const token = res.token;
        // const resetLink = `https://monapp.com/reset-password?token=${token}`;
        // const whatsappLink = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent("Voici votre lien : " + resetLink)}`;
        // window.open(whatsappLink, '_blank');
      },
      error: (err:any) => {
        //alert(err.error.message || 'Erreur lors de la demande');
        this.showError('Erreur lors de la demande');
      }
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
