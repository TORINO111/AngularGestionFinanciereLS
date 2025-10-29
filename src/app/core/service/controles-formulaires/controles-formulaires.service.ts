import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ControlesFormulairesService {

  allowNumbersOnly(event: KeyboardEvent) {
    const char = event.key;
    if (!/^\d$/.test(char)) { // autorise uniquement 0-9
      event.preventDefault();
    }
  }

  allowNumbersAndDecimal(event: KeyboardEvent) {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    // autorise chiffres et un seul point ou virgule
    if (!/^\d$/.test(char) && char !== '.' && char !== ',') {
      event.preventDefault();
    }
    if ((char === '.' || char === ',') && (input.value.includes('.') || input.value.includes(','))) {
      event.preventDefault();
    }
  }

  allowAlphanumericWithAccents(event: KeyboardEvent) {
    const char = event.key;

    // regex pour autoriser lettres, chiffres, espaces, tirets, apostrophes et lettres accentuées
    const regex = /^[a-zA-Z0-9\s\-\:\'éèêëàâäîïôöùûüçÉÈÊËÀÂÄÎÏÔÖÙÛÜÇ]$/;

    if (!regex.test(char)) {
      event.preventDefault();
    }
  }

  // quantiteMaxValidator(maxQuantite: number, typeMouvement: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = Number(control.value);
  //     if (typeMouvement !== 'VENTE') return null;
  //     if (isNaN(value)) return null;
  //     return value > maxQuantite ? { quantiteMax: { max: maxQuantite, actual: value } } : null;
  //   };
  // }

  // Validator dynamique : lit le mouvement et max depuis le formulaire
  quantiteMaxValidator(getQuantiteMax: () => number, getTypeMouvement: () => string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      const mouvement = getTypeMouvement();
      const maxQuantite = getQuantiteMax();

      if (mouvement !== 'VENTE') return null; 
      if (isNaN(value)) return null;
      return value > maxQuantite
        ? { quantiteMax: { max: maxQuantite, actual: value } }
        : null;
    };
  }

}
