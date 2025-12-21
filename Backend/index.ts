import * as dotenv from "dotenv";
dotenv.config();

import { AppServer } from "./src/app/AppServer";
import { Database } from "./src/config/db.config";

const startApp = async () => {
  try {
    // Connect to MongoDB
    const db = Database.getInstance();
    await db.connect();

    // Start the Express server
    const server = new AppServer();
    server.start();
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

startApp();

