import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEmployeeManagement extends Document {
  cognitoId: string;
  empName: string,
  empEmail: string,
  empAccount: string,
  empSkills: string,
  trainingIds: string[];
  department: string;
  hiredAt: Date;
}

const EmployeeManagementSchema: Schema<IEmployeeManagement> = new Schema({
  cognitoId: { type: String, ref: 'users', required: true },
  empName: { type: String, required: true },
  empEmail: { type: String, required: true },
  empAccount: { type: String, required: true },
  empSkills: { type: String, required: true },
  trainingIds: [{ type: String, ref: 'trainingRequirements' }],
  department: { type: String, required: true },
  hiredAt: { type: Date }
});

export default mongoose.model<IEmployeeManagement>('EmployeeManagement', EmployeeManagementSchema);