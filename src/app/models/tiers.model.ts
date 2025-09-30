export interface Tiers {
  id?: number;
  code: string;
  intitule: string;
  compteCollectif?: string;
  interlocuteur?: string;
  telephoneInterlocuteur?: string;
  telephoneTiers?: string;
  type: TiersNature; // enum: 'CLIENT', 'FOURNISSEUR', etc.
  societeId?: number;
}

export enum TiersNature {
  CLIENT = 'CLIENT',
  FOURNISSEUR = 'FOURNISSEUR',
  SALARIE = 'SALARIE',
  PARTENAIRE = 'PARTENAIRE'
}
