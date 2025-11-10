export enum TypeClientNumexis {
    CGA = 'CGA',
    CABINETCOMPTABLE = 'CABINETCOMPTABLE<',
    SAE = 'SAE'
}

export interface ClientNumexis {
    id: number;
    nom: string;
    sigle: string;
    telephone: string;
    email: string;
    adresse: string;
    numeroRccm: string;
    numeroIFU: string;
    ville: string;
    pays: string;
    typeClientNumexis: TypeClientNumexis;
}
