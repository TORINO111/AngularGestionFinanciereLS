export interface NatureOperation {
    id?: number;
    code: string;
    libelle: string;
    compteComptable?: string;
    sectionAnalytique?: string;
    codeJournal?:string;
    categorieId: number;
    categorieLibelle?:string;
    categorieType?:string;
    societeId?:number;
    typeNature?:string;
    sensParDefaut?:string;
    compteContrePartie?:string;
  }
  