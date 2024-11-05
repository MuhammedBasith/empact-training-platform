export interface CreateBatchDto {
    trainingRequirementId: string;
    batchNumber: string;
    trainerId: string;
    employeeIds: string[];
    duration: string; // Assuming duration is a string, adjust if necessary
    range: string;
    count: number;
}

export interface GetBatchResponse {
    success: boolean;
    data: any; // Define according to your Batch model
    message?: string; // Optional message property for error handling
}
