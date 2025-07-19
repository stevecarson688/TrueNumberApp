import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  user: mongoose.Types.ObjectId;
  generatedNumber: number;
  result: 'gagné' | 'perdu';
  balanceChange: number;
  newBalance: number;
  date: Date;
}

const GameSchema: Schema = new Schema<IGame>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  generatedNumber: { type: Number, required: true },
  result: { type: String, enum: ['gagné', 'perdu'], required: true },
  balanceChange: { type: Number, required: true },
  newBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IGame>('Game', GameSchema); 