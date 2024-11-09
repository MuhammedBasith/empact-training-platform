import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
    trainingRequirementId: mongoose.Types.ObjectId;
    batchNumber: number;
    trainerId: mongoose.Types.ObjectId;
    employeeIds: string[];
    duration: string;
    range: string;
    count: number;
    createdAt: Date;
    
}

const BatchSchema: Schema<IBatch> = new Schema({
    trainingRequirementId: { type: Schema.Types.ObjectId, required: true, ref: 'TrainingRequirement' },
    batchNumber: { type: Number, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    employeeIds: [{ type: String, ref: 'EmployeeManagement' }],
    duration: { type: String, required: true },
    range: { type: String, required: true },
    count: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBatch>('Batch', BatchSchema);
