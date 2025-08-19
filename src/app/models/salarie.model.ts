export interface Salarie {
    id?: number;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    poste?: string;
    matricule?: string;
    dateEmbauche?: string;
    dateDepart?: string;
    statut: string; // enum: 'ACTIF', 'INACTIF', etc.
    societeId?: number;
  }