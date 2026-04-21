import mongoose from 'mongoose';

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI or MONGO_URI is not defined');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}

export default connectDb;