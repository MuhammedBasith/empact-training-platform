// user.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  cognitoId: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  cognitoId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: ['manager', 'employee', 'trainer', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
