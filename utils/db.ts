import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return null;

  const Db =
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_DATABASE
      : process.env.REMOTE_DATABASE;
  if (!Db) {
    return null;
  }

  await mongoose
    .connect(Db)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err: any) => {
      console.error("ERROR", "connecting to database failed", err);
    });
};
