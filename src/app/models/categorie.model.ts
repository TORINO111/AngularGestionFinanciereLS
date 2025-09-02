import { TypeCategorie } from "./type-categorie.model";

export interface Categorie {
    id?: number;
    libelle: string;
    code: string;
    //type: 'RECETTE' | 'DEPENSE' | 'SALAIRE';
    type: TypeCategorie;
  }
  