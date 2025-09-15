export class NatureOperationRequest {
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

export class NatureOperationDto {
    id: number;
    code: string;
    libelle: string;

    compteComptableId: number;
    compteContrePartieId: number;
    sectionAnalytiqueId: number;
    categorieId: number;
    codeJournalId: number;
    societeId: number;

    compteComptableLibelle: string;
    compteContrePartieLibelle: string;
    sectionAnalytiqueLibelle: string;
    categorieLibelle: string;
    categorieType: string;
    codeJournal: string;
    libelleJournal: string;
    societeLibelle: string;

    typeNature: string;
    sensParDefaut: string;
    sensLibelle: string;
}
