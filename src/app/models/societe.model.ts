export interface Societe {
    id?: number;
    nom: string;
    telephone: string;
    email: string;
    adresse: string;
    numeroIFU: string;
    numeroRccm: string;
    comptableId?: string;
    comptableNom?:string;
    pays?: string;
    ville?: string;
}
  