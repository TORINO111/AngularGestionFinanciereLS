export interface PlanAnalytique {
  id?: number;
  sectionsAnalytiques: number[];
  societe: number;
}

export interface SectionAnalytiqueDTO {
  id: number;
  libelle: string;
}

export interface PlanAnalytiqueDTO {
  id?: number;
  sectionsAnalytiques: SectionAnalytiqueDTO[];
  societe: string;
}
