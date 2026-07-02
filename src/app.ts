import express, { type Express } from "express";
import { routes } from "./routes/index.js";

export class App {
  private readonly express: Express;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(routes);
  }

  get instance(): Express {
    return this.express;
  }
}
