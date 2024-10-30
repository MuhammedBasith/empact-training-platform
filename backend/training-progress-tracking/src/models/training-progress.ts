import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainerFeedbackWithProgress extends Document {
    batchId: mongoose.Types.ObjectId;
    trainerId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    feedback: string;
    createdAt: Date;
    trainingId: mongoose.Types.ObjectId;
    progress: number; // Percentage completion
    status: 'not started' | 'in progress' | 'completed';
    startedAt?: Date;
    completedAt?: Date;
}

const TrainerFeedbackWithProgressSchema: Schema<ITrainerFeedbackWithProgress> = new Schema({
    batchId: { type: Schema.Types.ObjectId, required: true, ref: 'Batch' },
    trainerId: { type: Schema.Types.ObjectId, required: true, ref: 'Trainer' },
    employeeId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // Fields from trainingProgress
    trainingId: { type: Schema.Types.ObjectId, required: true, ref: 'trainingRequirements' },
    progress: { type: Number, min: 0, max: 100, default: 0 }, // Percentage completion
    status: { type: String, enum: ['not started', 'in progress', 'completed'], default: 'not started' },
    startedAt: { type: Date },
    completedAt: { type: Date }
});

const TrainerFeedbackWithProgress = mongoose.model<ITrainerFeedbackWithProgress>('TrainerFeedbackWithProgress', TrainerFeedbackWithProgressSchema);

export default TrainerFeedbackWithProgress;
