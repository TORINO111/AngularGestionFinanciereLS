export interface Operation {
    id?: number;
    montant: number;
    details: string;
    dateOperation: string; // format ISO (ex: 2025-06-20T12:00:00)
    natureOperationId: number;
    natureOperationLibelle: string;
    tiersId?: number;
    tiers?: string;
    societeId?:number;
    societeNom?:string;
    comptableId?:number;
    comptableNom?:string;
  }

  export interface OperationImportDTO {
    ligne: number;
    natureOperation: string;
    tiers: string;
    message: string;
  }
  export interface ImportOperationResultDTO {
    success: boolean;
    message: string;
    lignesImportees: number;
    erreurs: OperationImportDTO[];
  } 
  