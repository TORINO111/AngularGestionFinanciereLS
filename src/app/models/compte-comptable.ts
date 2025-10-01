export interface CompteComptableDTO {
  id?: number;
  code: string;
  intitule: string;
  planComptableId: number;
  planComptableLibelle?: string;
  type?: string;
  classeCompte: string;
}

export interface CompteSelect {
  id: number;
  code: string;
  intitule: string;
}