import { PlanAnalytique } from 'src/app/models/plan-analytique.model';
export interface SectionAnalytiqueRequest {
  libelle: string;
  societeId: number
}

export interface SectionAnalytiqueDTO {
  id?: number;
  code: string;
  libelle: string;
  planAnalytique: string
}