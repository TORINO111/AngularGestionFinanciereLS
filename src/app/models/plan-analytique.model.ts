import { SectionAnalytiqueDTO } from "./section-analytique.model";

export interface PlanAnalytique {
  id?: number;
  intitule: string;
  societeId: number
}

export interface PlanAnalytiqueDTO {
  id?: number;
  intitule: string;
}
