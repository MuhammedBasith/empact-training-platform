import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeManagement extends Document {
  userId: mongoose.Types.ObjectId;
  trainingIds: mongoose.Types.ObjectId[];
  department: string;
  role: 'employee';
  hiredAt: Date;
}

const EmployeeManagementSchema: Schema<IEmployeeManagement> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  trainingIds: [{ type: Schema.Types.ObjectId, ref: 'trainingRequirements' }],
  department: { type: String, required: true },
  role: { type: String, enum: ['employee'], required: true },
  hiredAt: { type: Date, required: true }
});

export default mongoose.model<IEmployeeManagement>('EmployeeManagement', EmployeeManagementSchema);