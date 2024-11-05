import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Trainer
export interface ITrainer extends Document {
    cognitoId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    expertise: string[];
    bio?: string;
    trainingIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    batchIDs:mongoose.Types.ObjectId[]
}

// Create the Trainer schema
const TrainerSchema: Schema<ITrainer> = new Schema({
    cognitoId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    expertise: { type: [String], required: true },
    bio: { type: String },
    trainingIds: [{ type: mongoose.Types.ObjectId, ref: 'trainingRequirements' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    batchIDs:[{ type: Schema.Types.ObjectId}]             
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create the Trainer model
const TrainerManagement = mongoose.model<ITrainer>('Trainer', TrainerSchema);

export default TrainerManagement;
