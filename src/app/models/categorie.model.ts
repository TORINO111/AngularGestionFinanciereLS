
export interface Categorie {
    id?: number;
    libelle: string;
    code: string;
    //type: 'RECETTE' | 'DEPENSE' | 'SALAIRE';
    type: 'RECETTE' | 'DEPENSE' | 'TRESORERIE' | 'SALAIRE' | 'IMMOBILISATION';
  }
  