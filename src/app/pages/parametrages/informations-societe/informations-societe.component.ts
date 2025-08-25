import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TresorerieService } from 'src/app/services/tresorerie/tresorerie.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-informations-societe',
    templateUrl: './informations-societe.component.html',
    styleUrls: ['./informations-societe.component.scss'],
    standalone: false
})
export class InformationsSocieteComponent implements OnInit {

    societeForm: UntypedFormGroup;
    imagePreview: string | ArrayBuffer | null = null;
    logoPreview: string | null = null;
    pageTitle: BreadcrumbItem[] = [];
    loading = false;
    result = false;
    lignes: any[] = [];
    selectedIndex: number | null = null;
    formVisible = false;
  
    constructor(
      private tresorerieService: TresorerieService,
      private toastr: ToastrService,
      private fb: UntypedFormBuilder
    ) {
      this.societeForm = this.fb.group({
        id: [],
        nom: ['', Validators.required],
        sigle: [''],
        telephone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        adresse: ['', Validators.required],
        rccm: [''],
        ifu: [''],
        ville: [''],
        logo: [null]
      });
    }
  
    ngOnInit(): void {
      this.pageTitle = [{ label: 'Vos infos sociétés', path: '/', active: true }];
      this.listeSocietes();
    }
  
    // Récupère les infos d'une société existante
    listeSocietes(): void {
      this.tresorerieService.getSocietes().subscribe({
        next: (data: any[]) => {
          const societe = data[0];
          if (societe) {
            this.societeForm.patchValue({
              id: societe.id,
              nom: societe.nom,
              sigle: societe.sigle,
              telephone: societe.telephone,
              email: societe.email,
              adresse: societe.adresse,
              rccm: societe.rccm,
              ifu: societe.ifu,
              ville: societe.ville
            });
            this.logoPreview = `http://localhost:8082/tresorerie/api/logo/${societe.logoPath}`;
          }
        },
        error: err => {
          console.log('Erreur de récupération de société', err);
          this.showError('Impossible de charger les données de la société');
        }
      });
    }
  
    // Gestion du changement de logo
    onLogoSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
  
      if (!file) return;
  
      if (!file.type.startsWith('image/')) {
        this.showError('Veuillez sélectionner un fichier image valide (jpg, png...)');
        input.value = '';
        return;
      }
  
      // Ajout au formulaire
      this.societeForm.patchValue({ logo: file });
      this.societeForm.get('logo')?.updateValueAndValidity();
  
      // Aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  
    // Enregistrement du formulaire
    onSubmit(): void {
      const isCreation = !this.societeForm.value.id; // vrai si pas encore d’ID (création)

      if (!this.societeForm.valid) {
        this.showWarning('Formulaire invalide');
        return;
      }

      if ((isCreation && !this.societeForm.value.logo)) {
        this.showWarning('logo manquant');
        return;
      }
    
      this.loading = true; // ✅ Démarrage du loader
    
      const formData = new FormData();
      const formValues = { ...this.societeForm.value };
      const logoFile = formValues.logo;
      delete formValues.logo;
    
      formData.append('societe', new Blob([JSON.stringify(formValues)], { type: 'application/json' }));
      if (logoFile instanceof File) {
        formData.append('logo', logoFile);
      }
    
      /*this.tresorerieService.creerSociete(formData).subscribe({
        next: () => {
          this.showSuccess('Société enregistrée avec succès');
        },
        error: err => {
          console.log('Erreur lors de l’enregistrement', err);
          this.showError('Erreur lors de l’enregistrement');
        },
        complete: () => {
          this.loading = false; // ✅ Fin du loader, succès ou échec
        }
      })*/
        ;
    }
    
  
    // Notifications
    private showSuccess(message: string): void {
      this.toastr.success(`${message}!`, 'Succès', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });
    }
  
    private showError(message: string): void {
      this.toastr.error(`${message}!`, 'Erreur', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });
    }
    private showWarning(message: string): void {
      this.toastr.warning(`${message}!`, 'Warning', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });
    }
  }
  
