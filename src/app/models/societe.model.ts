export interface Societe {
    id?: number;
    nom: string;
    paysId: number;
    paysNom: string;
    telephone: string;
    email: string;
    adresse: string;
    numeroIFU: string;
    comptableId?: string;
    comptableNom?:string;
  }
  