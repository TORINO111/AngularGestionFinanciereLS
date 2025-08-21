import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { ExerciceComptableService } from 'src/app/services/exercice-comptable.service';
import { SocieteSelectionService } from 'src/app/services/societe-selection.service';
import { ExerciceComptable } from '../../../models/exercice-comptable.model';
import { BreadcrumbItem } from '../../../shared/page-title/page-title/page-title.model';

@Component({
    selector: 'app-gestion-exercice',
    templateUrl: './gestion-exercice.component.html',
    styleUrls: ['./gestion-exercice.component.scss'],
    standalone: false
})
export class GestionExerciceComponent implements OnInit {

  exercices: ExerciceComptable[] = [];
  societeId!: number;
  nouvelleAnnee: number = new Date().getFullYear();
  exerciceEnCours: boolean = false;
  exerciceForm: UntypedFormGroup;
  loading = false;
  pageTitle: BreadcrumbItem[] = [];
  result=false;
  formVisible=false;


  constructor(
    private exerciceService: ExerciceComptableService,
    private societeSelectionService: SocieteSelectionService,
    private fb: UntypedFormBuilder
  ) {
    this.exerciceForm = this.fb.group({
      annee: [this.nouvelleAnnee, [Validators.required, Validators.min(2024)]],
      dateOuverture: [null, Validators.required],
      dateCloture: [null, Validators.required],
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos exercices', path: '/', active: true }];
    
    this.societeSelectionService.selectedSociete$.subscribe(societe => {
      
      this.exercices =[];
      if (societe) {
        this.societeId=societe.id?? 0;
        this.loadExercices();
      }else{
        this.result=true;
        this.exercices =[];
      }
      
    });
    
  }

  nouvelExercice(){
    this.formVisible=true;
  }

  loadExercices(): void {
    this.exerciceService.findAllBySociete(this.societeId).subscribe({
      next: (data) => {
        //console.log(data)
        this.exercices = data;
        this.exerciceEnCours = this.exercices.some(ex => !ex.cloture);
        this.result=true;
      } ,
      error: () => {
        this.result=true;
        //alert('Erreur lors du chargement des exercices.')
      }
    });
  }

  creerExercice(): void {
    if (this.exerciceForm.invalid) return;

    if (this.exerciceEnCours) {
      alert("Un exercice est déjà ouvert.");
      return;
    }

    const societeId = this.societeId;
    const exercice = {
      ...this.exerciceForm.value,
      societeId
    };

    // console.log(exercice);
    // return;
    this.loading = true;
    this.exerciceService.creerExercice(exercice).subscribe({
      next: () => {
        this.loading = false;
        this.exerciceForm.reset({ annee: new Date().getFullYear() });
        this.loadExercices();
        alert('Exercice ouvert avec succès !');
        this.formVisible=false;
      },
      error: err => {
        this.loading = false;
        alert('Erreur : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }

  cloturerExercice(exercice:ExerciceComptable): void {
    if (!confirm('Voulez-vous vraiment clôturer cet exercice ?')) return;

    this.exerciceService.cloturerExercice(exercice.id!).subscribe({
      next: () => {
        alert('Exercice clôturé.');
        this.loadExercices();
      },
      error: err => alert('Erreur lors de la clôture.')
    });
  }

  

}
