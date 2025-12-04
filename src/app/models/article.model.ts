export interface ArticleCategorieMouvementCompte {
    typeMouvement: string;
    typeCategorie: string;
    compteId: number;
    journalId: number;
}

export interface ArticleDTO {
    id?: number;
    designation: string;
    code?: string;
    prixUnitaire: number;
    quantite: number;
    comptesParCategorie?: ArticleCategorieMouvementCompte[];
}