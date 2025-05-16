import mongoose from "mongoose";

// Add global connection status tracker
global.mongoDBConnected = false;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    // Set the connection status to true
    global.mongoDBConnected = true;

    console.log(
      `\nMongoDB connected !! DB HOST :: ${connectionInstance.connection.host}`
    );

    // Add event listeners to track connection status
    mongoose.connection.on('disconnected', () => {
      global.mongoDBConnected = false;
      console.log('MongoDB disconnected!');
    });

    mongoose.connection.on('connected', () => {
      global.mongoDBConnected = true;
      console.log('MongoDB reconnected!');
    });

    return connectionInstance;
  } catch (error) {
    global.mongoDBConnected = false;
    console.log("MONGODB connection FAILED :: ", error);
    process.exit(1);
  }
};

export default connectDB;