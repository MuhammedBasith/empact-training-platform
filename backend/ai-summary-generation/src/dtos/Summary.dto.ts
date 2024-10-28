export interface CreateSummaryDTO {
    trainingRequirementId: string;
    summary: string;
    department: string
    trainingType: string
    duration: string
    objectives: string
  }
  
  export interface EditSummaryDTO {
    editedSummary: string;
  }
  
  export interface ConfirmSummaryDTO {
    confirmed: boolean;
  }
  