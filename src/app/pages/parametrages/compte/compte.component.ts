import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/core/service/auth.service";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title/page-title.model";
import { TresorerieService } from "src/app/services/tresorerie/tresorerie.service";
import { UtilisateurService } from "src/app/services/utilisateurs/utilisateur.service";
@Component({
  selector: "app-compte",
  templateUrl: "./compte.component.html",
  styleUrls: ["./compte.component.scss"],
  standalone: false,
})
export class CompteComponent implements OnInit {
  passwordForm: UntypedFormGroup;
  userForm: UntypedFormGroup;
  result = false;
  loading = false;
  isConfirme = false;
  user: any;
  pageTitle: BreadcrumbItem[] = [];
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UtilisateurService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    const userJson = localStorage.getItem("user");
    this.user = userJson ? JSON.parse(userJson) : null;
    this.loadAndInitUserForm();

    this.passwordForm = this.fb.group({
      userId: this.user.id,
      oldPassword: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
      // password: ['', [Validators.required, Validators.pattern(this.passwordRegex), Validators.minLength(8)]],
      // confirmation: ['', [Validators.required, Validators.pattern(this.passwordRegex), Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Vos infos", path: "/", active: true }];
  }

  loadAndInitUserForm(): void {
    this.userService.getUserById(this.user?.id).subscribe({
      next: (userData) => {
        this.user = userData;
        this.initForm();
        // Formatage automatique du téléphone
        // this.userForm.get("telephone")?.valueChanges.subscribe((value) => {
        //   if (this.userForm.get("telephone")?.valid && value) {
        //     const formatted = this.formatPhoneNumber(value);
        //     this.userForm
        //       .get("telephone")
        //       ?.setValue(formatted, { emitEvent: false });
        //   }
        // });
        this.result = true;
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l’utilisateur", err);
      },
    });
  }

  initForm(): void {
    //console.log(this.user)
    this.userForm = this.fb.group({
      id: [this.user?.id],
      nom: [this.user?.nom, [Validators.required]],
      prenom: [this.user?.prenom, [Validators.required]],
      email: [this.user?.email],
      // telephone: [this.user?.telephone, [this.validatePhoneNumber]],
      telephone: [this.user?.telephone, [Validators.required]],
      username: [this.user?.username, [Validators.required]],
      enabled: [this.user?.enabled],
      idRole: [this.user?.idRole],
    });
  }

  // Validator personnalisé
  validatePhoneNumber(
    control: UntypedFormControl
  ): { [key: string]: any } | null {
    if (!control.value) return null; // Ne valide pas si le champ est vide (optionnel)

    const cleaned = control.value.replace(/\D/g, "");
    const isValid =
      cleaned.length === 8 || // 70123456
      (cleaned.startsWith("226") && cleaned.length === 11) || // 22670123456
      (cleaned.startsWith("00226") && cleaned.length === 13); // 0022670123456

    return isValid ? null : { invalidPhoneNumber: true };
  }

  // Fonction de formatage
  // formatPhoneNumber(phoneNumber: string): string {
  //   const cleaned = phoneNumber.replace(/\D/g, "");

  //   if (cleaned.length === 8) {
  //     return `+226 ${cleaned.substring(0, 2)} ${cleaned.substring(
  //       2,
  //       4
  //     )} ${cleaned.substring(4, 6)} ${cleaned.substring(6)}`;
  //   } else if (cleaned.startsWith("226") && cleaned.length === 11) {
  //     return `+226 ${cleaned.substring(3, 5)} ${cleaned.substring(
  //       5,
  //       7
  //     )} ${cleaned.substring(7, 9)} ${cleaned.substring(9)}`;
  //   } else if (cleaned.startsWith("00226") && cleaned.length === 13) {
  //     return `+226 ${cleaned.substring(5, 7)} ${cleaned.substring(
  //       7,
  //       9
  //     )} ${cleaned.substring(9, 11)} ${cleaned.substring(11)}`;
  //   }
  //   return phoneNumber;
  // }

  loadCurrentUser(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (user: any) => {
        this.userForm = this.fb.group({
          id: [user.id],
          username: [
            user.username,
            [Validators.required, Validators.minLength(2)],
          ],
          email: [user.email],
          telephone: [user.telephone],
          nom: [user.nom, Validators.required],
          prenom: [user.prenom, Validators.required],
          enabled: [user.enabled],
          idRole: [user.idRole],
        });
        this.result = true;
      },
      error: (error: any) => {
        console.log(error);
        this.showError("Erreur los du chargement de l'utilisateur");
      },
    });
  }

  // onUpdateUser(userForm: any) {
  //   this.userLoading=true;
  //   //console.log(userForm.value)
  //   const tel = this.userForm.get('telephone')?.value;

  //   if (tel && this.userForm.get('telephone')?.invalid) {
  //     //console.log('Téléphone invalide');
  //     this.showWarning('Téléphone invalide');
  //     this.userLoading = false;
  //     return;
  //   }
  //   if(userForm.valid){
  //     console.log(userForm.value)
  //     this.tresorerieService.updateUtilisateur(userForm.value.id, userForm.value).subscribe(() => {
  //       this.userLoading = false;
  //       this.showSuccess('Modification effectuée avec succès');
  //       this.loadCurrentUser(userForm.value.id);
  //     }, error => {
  //       this.userLoading = false;
  //       this.showError('Échec de la modification');
  //     });
  //   }else{
  //     this.userLoading = false;
  //     this.showWarning('Formulaire invalide');
  //   }

  // }

  sendPassword(passwordForm: any) {
    if (passwordForm.valid) {
      this.loading = true;

      if (!(passwordForm.value.password === passwordForm.value.confirmation)) {
        this.showWarning(
          "Le mot de passe et la confirmation ne sont pas identiques"
        );
        this.loading = false;
        return;
      }

      this.authenticationService.sendPassword(passwordForm.value).subscribe({
        next: (data: any) => {
          this.loading = false;
          this.showSuccess("Modifié avec succès");
          this.authenticationService.logout();
          setTimeout(() => {
            this.router.navigate(["/auth/login"]);
          }, 1000);
        },
        error: (error: any) => {
          this.loading = false;
          this.showError("Modification échouée");
        },
      });
    } else {
      this.showWarning("Merci de remplir les champs");
    }
  }

  submitNewPassword(passwordForm: UntypedFormGroup) {
    if (!passwordForm.valid) {
      this.showWarning("Merci de remplir les champs manquants correctement");

      return;
    }
    const { password, confirmPassword } = passwordForm.value;
    if (password !== confirmPassword) {
      this.showWarning(
        "Le mot de passe et la confirmation ne sont pas identiques"
      );
      return;
    }

    this.loading = true;

    this.authenticationService.sendPassword(passwordForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccess("Mot de passe modifié avec succès");
      },
      error: (error: any) => {
        console.log("Error: ", error);
        this.loading = false;
        
        const message = error?.error?.message || "Modification échouée";
        this.showError(message);
      },
    });
  }

  showSuccess(message: string) {
    this.toastr.success(message + "!", "Success", {
      timeOut: 5000,
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,
    });
  }

  showError(message: string) {
    this.toastr.error(message + "!", "Error", {
      timeOut: 5000,
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,
    });
  }

  showWarning(message: string) {
    this.toastr.warning(message + "!", "Warning", {
      timeOut: 5000,
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,
    });
  }
}
