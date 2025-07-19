import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'client' | 'admin';
  balance: number;
  createdAt: Date;
  resetToken?: string;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema); 