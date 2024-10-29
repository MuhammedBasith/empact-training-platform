import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeManagement extends Document{
    userId: number;
    empName: string,
    empEmail: string,
    empAccount: string,
    empSkills: string,
    trainingIds: number;
    department: string;
    role: 'employee';
    hiredAt: Date;
}

const EmployeeManagementSchema: Schema<IEmployeeManagement> = new Schema({
    userId: { type: Number, ref: 'users', required: true },
    empName: {type: String, required:true},
    empEmail: {type: String, required: true},
    empAccount: {type: String, required: true},
    empSkills: {type: String, required: true},
    trainingIds: { type:Number },
    department: { type: String, required: true },
    role: { type: String, enum: ['employee'], required: true },
    hiredAt: { type: Date }
  });

export default mongoose.model<IEmployeeManagement>('EmployeeManagement', EmployeeManagementSchema);