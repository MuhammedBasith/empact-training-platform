import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
    trainingRequirementId: mongoose.Types.ObjectId;
    batchNumber: number;
    trainerId: mongoose.Types.ObjectId;
    employeeIds: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const BatchSchema: Schema<IBatch> = new Schema({
    trainingRequirementId: { type: Schema.Types.ObjectId, required: true, ref: 'TrainingRequirement' },
    batchNumber: { type: Number, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    employeeIds: [{ type: Schema.Types.ObjectId, ref: 'EmployeeManagement' }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBatch>('Batch', BatchSchema);
