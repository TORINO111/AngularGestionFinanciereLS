import { Injectable } from '@angular/core';
import { ExerciceComptable } from '../../models/exercice-comptable.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciceSelectionService {

  private selectedExerciceSubject = new BehaviorSubject<ExerciceComptable | null>(null);
  selectedExercice$ = this.selectedExerciceSubject.asObservable();

  setSelectedExercice(exercice: ExerciceComptable | null): void {
    this.selectedExerciceSubject.next(exercice);
  }

  getSelectedExercice(): ExerciceComptable | null {
    return this.selectedExerciceSubject.value;
  }
}
