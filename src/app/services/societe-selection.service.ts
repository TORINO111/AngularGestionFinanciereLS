import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Societe } from '../models/societe.model';

@Injectable({
  providedIn: 'root'
})
export class SocieteSelectionService {

  private selectedSocieteSubject = new BehaviorSubject<Societe | null>(this.getFromStorage());
    selectedSociete$ = this.selectedSocieteSubject.asObservable();

    setSociete(societe: Societe): void {
      this.selectedSocieteSubject.next(societe);
      localStorage.setItem('societeActive', JSON.stringify(societe));
    }

    getFromStorage(): Societe | null {
      const raw = localStorage.getItem('societeActive');
      return raw ? JSON.parse(raw) : null;
    }

    getSelected(): Societe | null {
      return this.selectedSocieteSubject.value;
    }

    clearSociete(): void {
      this.selectedSocieteSubject.next(null);
      localStorage.removeItem('societeActive');
    }
}
