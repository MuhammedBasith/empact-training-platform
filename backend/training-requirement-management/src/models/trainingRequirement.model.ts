import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingRequirement extends Document {
    managerId: mongoose.Types.ObjectId;
    department: string;
    trainingType: string;
    duration: string;
    objectives?: string;
    createdAt: Date;
    updatedAt: Date;
}

const trainingRequirementSchema = new Schema<ITrainingRequirement>({
    managerId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    department: { type: String, required: true },
    trainingType: { type: String, required: true },
    duration: { type: String, required: true },
    objectives: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITrainingRequirement>('TrainingRequirement', trainingRequirementSchema);
