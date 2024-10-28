import mongoose, { Document, Schema } from 'mongoose';

export interface ISummary extends Document {
  trainingRequirementId: mongoose.Types.ObjectId;
  summary: string;
  editedSummary?: string;
  confirmed: boolean;
  generatedAt: Date;
}

const SummarySchema: Schema = new Schema({
  trainingRequirementId: { type: Schema.Types.ObjectId, ref: 'trainingRequirements', required: true },
  summary: { type: String, required: true },
  editedSummary: { type: String },
  confirmed: { type: Boolean, default: false },
  generatedAt: { type: Date, default: Date.now },
});

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);
