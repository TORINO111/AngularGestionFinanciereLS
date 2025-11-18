import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ControlesFormulairesService {
  allowNumbersOnly(event: KeyboardEvent) {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    // Autoriser les combinaisons Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (
      (event.ctrlKey &&
        ["a", "c", "v", "x"].includes(event.key.toLowerCase())) ||
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    // Bloquer tout ce qui n’est pas un chiffre
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowNumbersAndDecimal(event: KeyboardEvent) {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    if (
      (event.ctrlKey &&
        ["a", "c", "v", "x"].includes(event.key.toLowerCase())) ||
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    const char = event.key;
    const input = event.target as HTMLInputElement;

    // autoriser chiffres et un seul point ou virgule
    if (!/^\d$/.test(char) && char !== "." && char !== ",") {
      event.preventDefault();
    }

    if (
      (char === "." || char === ",") &&
      (input.value.includes(".") || input.value.includes(","))
    ) {
      event.preventDefault();
    }
  }

  allowAlphanumericWithAccents(event: KeyboardEvent) {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    if (
      (event.ctrlKey &&
        ["a", "c", "v", "x"].includes(event.key.toLowerCase())) ||
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    const char = event.key;
    const regex = /^[a-zA-Z0-9\s\-\:\'éèêëàâäîïôöùûüçÉÈÊËÀÂÄÎÏÔÖÙÛÜÇ&]$/;

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
  quantiteMaxValidator(
    getQuantiteMax: () => number,
    getTypeMouvement: () => string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      const mouvement = getTypeMouvement();
      const maxQuantite = getQuantiteMax();

      if (mouvement !== "VENTE") return null;
      if (isNaN(value)) return null;
      return value > maxQuantite
        ? { quantiteMax: { max: maxQuantite, actual: value } }
        : null;
    };
  }
}
