export interface CreateTrainingRequirementDto {
    congnitoId;string;
    department: string;
    trainingType: string;
    trainingName:string,
    duration: string;
    objectives?: string;
    empCount: number; 
    prerequisite?: string;
    skills_to_train?: string;
}

export interface UpdateTrainingRequirementDto {
    department?: string;
    trainingType?: string;
    duration?: string;
    empCount: number; 
    objectives?: string;
}

export interface UpdateTrainingRequirementStatusDto {
    status?: boolean;
}
