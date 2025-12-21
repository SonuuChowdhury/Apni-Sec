import mongoose from "mongoose";

export class Database {
  private static instance: Database;
  private mongoUrl: string;

  private constructor() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    this.mongoUrl = mongoUri;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUrl);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error("MongoDB disconnection error:", error);
      throw error;
    }
  }

  public getConnection() {
    return mongoose.connection;
  }
}
