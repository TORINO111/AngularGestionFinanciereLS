export interface ArticleCategorieMouvementCompte {
    typeMouvement: string;
    typeCategorie: string;
    compteId: number;
}

export interface ArticleDTO {
    id?: number;
    designation: string;
    code?: string;
    prixUnitaire: number;
    quantite: number;
    comptesParCategorie?: ArticleCategorieMouvementCompte[];
}