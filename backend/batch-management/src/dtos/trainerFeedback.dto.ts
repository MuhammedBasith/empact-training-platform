export interface CreateTrainerFeedbackDto {
    batchId: string;
    trainerId: string;
    employeeId: string;
    feedback: string;
}

export interface TrainerFeedbackResponse {
    success: boolean;
    data: any; // Define according to your TrainerFeedback model
    message?: string; // Optional message property for error handling
}
