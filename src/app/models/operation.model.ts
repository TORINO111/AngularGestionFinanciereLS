export class OperationRequest {
    code: String;
    libelle: string;

    compteComptableId: number;
    sectionAnalytiqueId: number;
    categorieId: number;
    codeJournalId: number;
    societeId: number;
    compteContrePartieId: number;

    typeNature: string;
    sensParDefaut: string;
}

export class OperationDto {
  id: number;
  code: string;
  libelle: string;

  compteComptableId: number;
  compteComptableCode: string;  
  compteComptableIntitule: string;

  categorieId: number;
  categorieLibelle: string;

  codeJournalId: number;
  codeJournalLibelle: string;

  societeId: number;
  societeNom: string;

  sectionAnalytiqueId?: number;
  sectionAnalytiqueLibelle?: string;

  tiersId?: number;
  tiersLibelle?: string;

  montantHt: number;
  tva: number;
  montantTtc: number;

  sequence: number;
  date: string; 

}

