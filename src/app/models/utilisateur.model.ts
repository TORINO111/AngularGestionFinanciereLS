export enum Role {
  ENTREPRISE_USER = 'ENTREPRISE_USER',
  ENTREPRISE_ADMIN = 'ENTREPRISE_ADMIN',
  CLIENT_COMPTABLE = 'CLIENT_COMPTABLE',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  BAILLEUR = 'BAILLEUR',
  ADMIN = 'ADMIN',
}

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
    clientNumexisId?: number;
    bailleurId?: number;
    role: Role;
  }
  