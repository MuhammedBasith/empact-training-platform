import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
    trainingRequirementId: mongoose.Types.ObjectId;
    batchNumber: number;
    trainerId: mongoose.Types.ObjectId;
    employeeIds: mongoose.Types.ObjectId[];
    duration: string; // Assuming duration is a string, adjust if necessary
    range: string;
    count: number;
    createdAt: Date;
    
}

const BatchSchema: Schema<IBatch> = new Schema({
    trainingRequirementId: { type: Schema.Types.ObjectId, required: true, ref: 'TrainingRequirement' },
    batchNumber: { type: Number, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    employeeIds: [{ type: Schema.Types.ObjectId, ref: 'EmployeeManagement' }],
    duration: { type: String, required: true },  // Ensure duration is string
    range: { type: String, required: true },
    count: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBatch>('Batch', BatchSchema);
