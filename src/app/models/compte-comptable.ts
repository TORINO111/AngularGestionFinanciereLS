export interface CompteComptableDTO {
  id?: number;
  numero: string;
  intitule: string;
  planComptableId: number;
  planComptableLibelle?: string;
  type?: 'ACTIF' | 'PASSIF' | 'CHARGE' | 'PRODUIT';
  classeCompte: string;
}
