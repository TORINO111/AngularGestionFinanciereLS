export interface Tiers {
  id?: number;
  compte: string;
  intitule: string;
  compteCollectif?: string;
  interlocuteur?: string;
  telephoneInterlocuteur?: string;
  telephoneSociete?: string;
  type: string; // enum: 'CLIENT', 'FOURNISSEUR', etc.
  societeId?: number;
}

export enum TiersNature {
  CLIENT = 'CLIENT',
  FOURNISSEUR = 'FOURNISSEUR'
}
