export interface Utilisateur {
    id?: number;
    nom: string;
    prenom: string;
    username: string;
    email: string;
    password?: string;
    telephone?: string;
    type?: string;
    civilite?: string;
    enabled?: boolean;
    societeId?: number;
    roles: string[];
  }
  