const express: any = require("express");
import { Application } from "express";
const cors: any = require("cors");
import * as dotenv from "dotenv";
import userRoutes from "../routes/Routes";

dotenv.config();

export class AppServer {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;

    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    this.app.get("/", (req, res) => res.send("API running"));
    this.app.use("/api/users", userRoutes);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}
