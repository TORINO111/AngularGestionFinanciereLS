export interface Categorie {
  id?: number;
  code: string;
  libelle: string;
  type: string;

  // Comptes liés à la catégorie
  compteComptableIds: number[];
  compteComptableCodes: string[];
  compteComptableIntitules: string[];
}
