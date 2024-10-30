import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainerFeedback extends Document {
    batchId: mongoose.Types.ObjectId;
    trainerId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    feedback: string;
    createdAt: Date;
}

const TrainerFeedbackSchema: Schema<ITrainerFeedback> = new Schema({
    batchId: { type: Schema.Types.ObjectId, required: true, ref: 'Batch' },
    trainerId: { type: Schema.Types.ObjectId, required: true, ref: 'Trainer' },
    employeeId: { type: Schema.Types.ObjectId, required: true, ref: 'EmployeeManagement' },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITrainerFeedback>('TrainerFeedback', TrainerFeedbackSchema);
