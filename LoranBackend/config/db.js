import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const primaryUri = process.env.MONGO_URI;
    const fallbackUri = process.env.MONGO_FALLBACK_URI;
    const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 15000);
    const connectTimeoutMS = Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 15000);

    const connectionOptions = {
      serverSelectionTimeoutMS,
      connectTimeoutMS,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
    };

    if (!primaryUri) {
      throw new Error("MONGO_URI is not set");
    }

    // Try primary first, then fallback when available (for intermittent DNS/network issues).
    const urisToTry = [primaryUri, fallbackUri].filter(
      (value, index, arr) => !!value && arr.indexOf(value) === index
    );

    let lastError = null;

    for (let i = 0; i < urisToTry.length; i += 1) {
      const uri = urisToTry[i];
      const isFallbackAttempt = i > 0;
      try {
        const conn = await mongoose.connect(uri, connectionOptions);
        console.log(
          isFallbackAttempt
            ? `MongoDB Connected (fallback): ${conn.connection.host}`
            : `MongoDB Connected: ${conn.connection.host}`
        );
        return;
      } catch (attemptError) {
        lastError = attemptError;
        if (!isFallbackAttempt && urisToTry.length > 1) {
          console.warn(
            `⚠️ Primary Mongo connection failed (${attemptError.message}). Retrying with fallback URI...`
          );
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error; // Let server.js handle the exit
  }
};

export default connectDB;