export interface CreateTrainingRequirementDto {
    managerId: string;
    department: string;
    trainingType: string;
    duration: string;
    objectives?: string;
}

export interface UpdateTrainingRequirementDto {
    department?: string;
    trainingType?: string;
    duration?: string;
    objectives?: string;
}
