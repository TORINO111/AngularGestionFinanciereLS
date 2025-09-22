export interface CompteComptableDTO {
  id?: number;
  numero: string;
  codeComplet: string;
  intitule: string;
  planComptableId: number;
  planComptableLibelle?: string;
  type?: string;
  classeCompte: string;
}
