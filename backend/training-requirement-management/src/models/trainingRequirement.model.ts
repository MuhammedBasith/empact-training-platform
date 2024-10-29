import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingRequirement extends Document {
    managerId: mongoose.Types.ObjectId;
    department: string;
    trainingName: string;
    trainingType: string;
    duration: string;
    objectives?: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const trainingRequirementSchema = new Schema<ITrainingRequirement>({
    managerId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    department: { type: String, required: true },
    trainingName: {type: String},
    trainingType: { type: String, required: true },
    duration: { type: String, required: true },
    objectives: { type: String },
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITrainingRequirement>('TrainingRequirement', trainingRequirementSchema);
