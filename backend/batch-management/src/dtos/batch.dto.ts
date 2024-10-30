export interface CreateBatchDto {
    trainingRequirementId: string;
    batchNumber: string;
    trainerId: string;
    employeeIds: string[];
}

export interface GetBatchResponse {
    success: boolean;
    data: any; // Define according to your Batch model
    message?: string; // Optional message property for error handling
}
