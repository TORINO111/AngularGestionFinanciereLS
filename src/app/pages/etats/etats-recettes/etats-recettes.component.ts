import { Component, OnInit } from '@angular/core';
import { EtatService } from 'src/app/services/etat.service';
import { OperationDetailDTO } from 'src/app/models/operation-detail.model'; 
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { ToastrService } from 'ngx-toastr';
import { NatureOperationService } from 'src/app/services/nature-operation.service';
import { SocieteSelectionService } from 'src/app/services/societe-selection.service';
import { Societe } from 'src/app/models/societe.model';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ExerciceComptable } from 'src/app/models/exercice-comptable.model';
import { ExerciceComptableService } from 'src/app/services/exercice-comptable.service';
import {CodeJournal} from 'src/app/models/code-journal.model';

@Component({
    selector: 'app-etats-recettes',
    templateUrl: './etats-recettes.component.html',
    styleUrls: ['./etats-recettes.component.scss'],
    standalone: false
})
export class EtatsRecettesComponent implements OnInit {

  recettes: OperationDetailDTO[] = [];
  filtreForm: UntypedFormGroup;
  loading = false;
  societeActive: Societe | null = null;

  pageTitle: BreadcrumbItem[] = [];

  enCours = false;
  progression = 0;
  intervalId: any;
  result=false;
  codesjournaux:CodeJournal[] =[];
  exerciceEnCours?: ExerciceComptable;
  exerciceId?:number;
  message:string;

  private destroy$ = new Subject<void>();

  constructor(private etatService: EtatService,
              private societeSelectionService: SocieteSelectionService,
              private natureOperationService: NatureOperationService,
              private fb: UntypedFormBuilder,private toastr: ToastrService,
              private exerciceService: ExerciceComptableService) {
                

                this.filtreForm = this.fb.group({
                  societeId: [],
                  from: [new Date().toISOString().substring(0, 10)],
                  to: [new Date().toISOString().substring(0, 10)],
                  codeJournal:[]
                });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'recettes', path: '/', active: true }];
    this.init();
    
  }

  private init(): void {
    this.chargerCodeJournal();
  
    this.societeSelectionService.selectedSociete$
      .pipe(
        takeUntil(this.destroy$),
        filter((s): s is Societe => !!s)
      )
      .subscribe(societe => {
        this.societeActive = societe;
        this.message = '';
        this.loadExerciceEnCours(societe.id!);
        this.filtreForm.patchValue({
          societeId: societe.id
        });
      });
  }

  private loadExerciceEnCours(societeId: number): void {
    this.exerciceService.getExerciceEnCoursBySociete(societeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: exercice => {
          if (exercice) {
            this.exerciceEnCours = exercice;
            this.exerciceId = exercice.id;
            this.message = '';
            this.chargerRecettes();
          } else {
            this.exerciceEnCours = undefined;
            this.message = "Aucun exercice en cours pour la société sélectionnée.";
          }
        },
        error: () => {
          this.exerciceEnCours = undefined;
          this.message = "Erreur lors de la récupération de l'exercice en cours.";
        }
      });
  }
  

  chargerRecettes(): void {
    this.loading = true;
    const { societeId, from, to, codeJournal } = this.filtreForm.value;
  
    this.etatService.getEtatOperations('RECETTE', societeId, from, to, codeJournal)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.recettes = data;
          this.loading = false;
          this.result = true;
        },
        error: () => {
          console.error('Erreur de chargement des dépenses');
          this.loading = false;
          this.result = true;
          this.showError('Erreur lors du chargement des dépenses');
        }
      });
  }
  

  chargerCodeJournal(): void {
    this.natureOperationService.getAllCodeJournal()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.codesjournaux = data;
          
        },
        error: (error) => {
          console.error('Erreur lors du chargement des codes journaux', error);
         
          this.showError('Erreur lors du chargement des codes journaux');
        }
      });
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  
    const { societeId, from, to ,codeJournal} = this.filtreForm.value;
    this.etatService.exportEtatExcel("RECETTE",societeId, from, to,codeJournal).subscribe({
      next: (blob: any) => {
        clearInterval(this.intervalId);
        this.progression = 100;
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'etat-recettes.xlsx';
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
