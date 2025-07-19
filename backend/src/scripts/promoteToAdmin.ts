import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';

dotenv.config();

const email = process.argv[2] || 'stevecarson195@gmail.com'; // Email par défaut fourni

if (!email) {
  console.error('Usage: ts-node scripts/promoteToAdmin.ts <email>');
  process.exit(1);
}

async function promote() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: 'admin' } },
    { new: true }
  );
  if (user) {
    console.log(`Utilisateur ${user.email} promu admin !`);
  } else {
    console.log('Utilisateur non trouvé.');
  }
  await mongoose.disconnect();
}

promote(); 