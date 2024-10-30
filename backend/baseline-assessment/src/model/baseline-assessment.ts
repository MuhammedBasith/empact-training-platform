import mongoose, { Schema, Document } from 'mongoose';

// Interface for BaselineAssessment
export interface IBaselineAssessment extends Document {
    trainingId: mongoose.Types.ObjectId; 
    empId: { type: mongoose.Types.ObjectId, ref: 'employees'},
    score?: number; 
    completedAt?: Date; 
}

// Schema for BaselineAssessment
const BaselineAssessmentSchema: Schema = new Schema(
    {
        trainingId: { type: mongoose.Types.ObjectId, ref: 'trainingRequirements', required: true },
        empId: { type: mongoose.Types.ObjectId, ref: 'employees', required: true },
        score: { type: Number, min: 0, max: 100 }, // Optional score
        completedAt: { type: Date } // Date of completion
    },
    { timestamps: false } // Set timestamps to false
);

// Export the model
export default mongoose.model<IBaselineAssessment>('BaselineAssessment', BaselineAssessmentSchema);
