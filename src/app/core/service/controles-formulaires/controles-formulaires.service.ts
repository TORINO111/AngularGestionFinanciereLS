import { Injectable } from '@angular/core';

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
}
