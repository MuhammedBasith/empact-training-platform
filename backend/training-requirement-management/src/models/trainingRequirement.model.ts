import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ITrainingRequirement extends Document {
    cognitoId: string;
    batchIds: string[] | null,
    department: string;
    trainingName: string;
    trainingType: string;
    duration: string;
    objectives?: string;
    empCount: number; 
    prerequisite?: string;
    skills_to_train?: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const trainingRequirementSchema = new Schema<ITrainingRequirement>({
    cognitoId: { type: String, ref: 'users', required: true },
    batchIds:{ type: [String], ref: 'batches' ,default: null},
    department: { type: String, required: true },
    trainingName: {type: String},
    trainingType: { type: String, required: true },
    duration: { type: String, required: true },
    objectives: { type: String },
    empCount: { type: Number, default: 0 },
    prerequisite: { type: String },
    skills_to_train: { type: String },
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITrainingRequirement>('TrainingRequirement', trainingRequirementSchema);
