import { Component, OnInit } from '@angular/core';
import { EtatService } from 'src/app/services/etat.service';
import { OperationDetailDTO } from 'src/app/models/operation-detail.model'; 
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
import { SocieteSelectionService } from 'src/app/services/societe-selection.service';
import { Societe } from 'src/app/models/societe.model';
import { EcritureComptableDTO } from '../../../models/ecriture-comptable.model';
import { Subject } from 'rxjs';
import { ExerciceComptableService } from 'src/app/services/exercice-comptable.service';
@Component({
    selector: 'app-ecritures-comptables',
    templateUrl: './ecritures-comptables.component.html',
    styleUrls: ['./ecritures-comptables.component.scss'],
    standalone: false
})
export class EcrituresComptablesComponent implements OnInit {

  ecritures: EcritureComptableDTO[] = [];
  filtreForm: UntypedFormGroup;
  loading = false;

  societeActive: Societe | null = null;
  societeId?:number;
  pageTitle: BreadcrumbItem[] = [];

  enCours = false;
  progression = 0;
  intervalId: any;

  private destroy$ = new Subject<void>();
  message:string;

  result=false;
  constructor(private etatService: EtatService, 
              private societeSelectionService: SocieteSelectionService,
              private fb: UntypedFormBuilder,private toastr: ToastrService,
              private exerciceService: ExerciceComptableService) {
    this.filtreForm = this.fb.group({
      societeId: [],
      from: [new Date().toISOString().substring(0, 10)],
      to: [new Date().toISOString().substring(0, 10)]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'vos écritures', path: '/', active: true }];
    
    this.societeSelectionService.selectedSociete$.subscribe(societe => {
      this.societeActive = societe;
      
      if (societe) {
        this.societeId=societe.id;
        this.filtreForm.patchValue({
          //societeId: this.societeActive.id
        });
        this.chargerEcrituresComptables();
      }
    });
  }

  chargerEcrituresComptables(): void {
    this.loading = true;
    const { societeId, from, to} = this.filtreForm.value;

    this.etatService.getECrituresComptables(societeId, from, to).subscribe({
      next: (data) => {
        this.ecritures = data;
        this.loading = false;
        this.result = true;
      },
      error: () => {
        console.error('Erreur de chargement');
        this.loading = false;
        this.result = true;
      }
    });
  }

  exporterPDF() {
    this.enCours = true;
    this.progression = 0;
  
    // Lancer une animation simulée (jusqu'à 80 %)
    this.intervalId = setInterval(() => {
      if (this.progression < 80) {
        this.progression += 2; // Ajustable selon la vitesse désirée
      }
    }, 100); // Chaque 100 ms
  
    const { societeId, from, to ,codeJournal} = this.filtreForm.value;
    this.etatService.exportEtatPDF("RECETTE",societeId, from, to,codeJournal).subscribe({
      next: (blob: any) => {
        clearInterval(this.intervalId);
        this.progression = 100;
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'etat-recettes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
  
        setTimeout(() => {
          this.enCours = false;
          this.progression = 0;
        }, 500); // délai pour cacher la barre
      },
      error: (error) => {
        clearInterval(this.intervalId);
        console.log('Erreur lors du téléchargement', error);
        this.enCours = false;
        this.progression = 0;
        this.showError('Erreur lors du téléchargement');
      }
    });
  }

  exporterExcel() {
    this.enCours = true;
    this.progression = 0;
  
    // Lancer une animation simulée (jusqu'à 80 %)
    this.intervalId = setInterval(() => {
      if (this.progression < 80) {
        this.progression += 2; // Ajustable selon la vitesse désirée
      }
    }, 100); // Chaque 100 ms
  
    const { societeId, from, to } = this.filtreForm.value;
    this.etatService.exportECrituresExcel(societeId, from, to).subscribe({
      next: (blob: any) => {
        clearInterval(this.intervalId);
        this.progression = 100;
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ecritures-comptables.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
  
        setTimeout(() => {
          this.enCours = false;
          this.progression = 0;
        }, 500); // délai pour cacher la barre
      },
      error: (error) => {
        clearInterval(this.intervalId);
        console.log('Erreur lors du téléchargement', error);
        this.enCours = false;
        this.progression = 0;
        this.showError('Erreur lors du téléchargement');
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
}
