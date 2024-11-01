export interface CreateSummaryDTO {
    trainingRequirementId: string;
    summary: string;
    department: string
    trainingName:string
    trainingType: string
    duration: string
    objectives: string
    prerequisite: string
    skills_to_train: string
  }
  
  export interface EditSummaryDTO {
    editedSummary: string;
  }
  
  export interface ConfirmSummaryDTO {
    confirmed: boolean;
  }
  