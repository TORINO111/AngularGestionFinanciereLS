import { Societe } from 'src/app/models/societe.model';
export interface PlanComptable {
    id?: number;
    societe: number;
    intitule: string;
    societeId?: number
  }