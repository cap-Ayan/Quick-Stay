import mongoose from "mongoose";


const dbConnect = async () => {
 const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set. Add it to server/.env and restart the server.");
    throw new Error("Missing MONGO_URI");
  }

  try {
    await mongoose.connect(uri+'/hotel-booking');
    console.log("Connected to DB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
};

export default dbConnect;