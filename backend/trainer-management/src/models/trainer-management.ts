import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainer extends Document {
    cognitoId: string;
    name: string;
    email: string;
    expertise: string[];
    bio?: string;
    trainingIds: string[];
    createdAt: Date;
    updatedAt: Date;
    batchIDs?:string[]
}

// Create the Trainer schema
const TrainerSchema: Schema<ITrainer> = new Schema({
    cognitoId: { type: String, ref: 'users', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: { type: [String], required: true },
    bio: { type: String },
    trainingIds: [{ type: String, ref: 'trainingRequirements' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    batchIDs:[{ type: String}]             
}, {
    timestamps: true
});

// Create the Trainer model
const TrainerManagement = mongoose.model<ITrainer>('Trainer', TrainerSchema);

export default TrainerManagement;
