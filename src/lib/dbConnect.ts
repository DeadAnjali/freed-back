import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

  if (connection.isConnected) {
    console.log("dbConnect: Already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '');
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected");
  } catch (err) {
    console.log("Database Connection failed",err);
  }
}

export default dbConnect;``