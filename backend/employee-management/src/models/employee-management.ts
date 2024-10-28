import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeManagement extends Document{
    userId: number;
    trainingIds: number;
    department: string;
    role: 'employee';
    hiredAt: Date;
}

const EmployeeManagementSchema: Schema<IEmployeeManagement> = new Schema({
    userId: { type: Number, ref: 'users', required: true },
    trainingIds: { type:Number },
    department: { type: String, required: true },
    role: { type: String, enum: ['employee'], required: true },
    hiredAt: { type: Date, required: true }
  });

export default mongoose.model<IEmployeeManagement>('EmployeeManagement', EmployeeManagementSchema);