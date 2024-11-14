import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
    trainingRequirementId: string;
    batchNumber: number;
    trainerId: string;
    employeeIds: string[];
    duration: string;
    range: string;
    count: number;
    createdAt: Date;
    
}

const BatchSchema: Schema<IBatch> = new Schema({
    trainingRequirementId: { type: String, required: true, ref: 'TrainingRequirement' },
    batchNumber: { type: Number, required: true },
    trainerId: { type: String, ref: 'Trainer' },
    employeeIds: [{ type: String, ref: 'EmployeeManagement' }],
    duration: { type: String, required: true },
    range: { type: String, required: true },
    count: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBatch>('Batch', BatchSchema);
