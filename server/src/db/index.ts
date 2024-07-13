import mongoose from 'mongoose';

export const connectDB = () => {
  const db = process.env.MONGO_URI || '';
  mongoose
    .connect(db)
    .then(() => {
      console.log('Successfully connected to database');
    })
    .catch((err) => {
      console.error('ERROR', 'connecting to database failed', err);
    });
};
