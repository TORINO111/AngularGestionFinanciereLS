export interface TiersCategorieCompte {
  typeCategorie: string;
  compteId: number;
}

export interface Tiers {
  id?: number;
  intitule: string;
  interlocuteur?: string;
  telephoneInterlocuteur?: string;
  telephoneTiers?: string;
  type: TiersNature;
  societeId?: number;
  comptesParCategorie?: TiersCategorieCompte[];
}


export enum TiersNature {
  CLIENT = 'CLIENT',
  FOURNISSEUR = 'FOURNISSEUR',
  SALARIE = 'SALARIE',
  PARTENAIRE = 'PARTENAIRE'
}
