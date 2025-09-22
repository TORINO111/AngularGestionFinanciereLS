import { SectionAnalytiqueDTO } from "./section-analytique.model";

export interface PlanAnalytique {
  id?: number;
  sectionsAnalytiques: number[];
  societe: number;
}

export interface PlanAnalytiqueDTO {
  id?: number;
  sectionsAnalytiques: SectionAnalytiqueDTO[];
  societe: string;
}
