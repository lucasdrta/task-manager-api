import type { Server as HttpServer } from "node:http";
import { App } from "./app.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

export class Server {
  private readonly app: App;
  private httpServer?: HttpServer;
  private readonly port: number;
  private isShuttingDown = false;

  constructor(port: number = Number(process.env.PORT) || 3333) {
    this.port = port;
    this.app = new App();
  }

  get expressApp() {
    return this.app.instance;
  }

  async start(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.httpServer = this.app.instance.listen(this.port, () => {
        console.log(`API listening on port ${this.port}`);
        this.registerShutdownHandlers();
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.httpServer) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.httpServer!.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        this.httpServer = undefined;
        resolve();
      });
    });
  }

  private registerShutdownHandlers(): void {
    if (process.env.WATCH_MODE === "true") {
      process.on("SIGINT", () => {
        void this.shutdown("SIGINT");
      });

      // tsx watch sends SIGTERM on reload — exit fast, skip graceful shutdown
      process.on("SIGTERM", () => process.exit(0));
      return;
    }

    const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];

    for (const signal of signals) {
      process.on(signal, () => {
        void this.shutdown(signal);
      });
    }
  }

  private async shutdown(signal: NodeJS.Signals): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    console.log(`Received ${signal}, shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    forceExitTimer.unref();

    try {
      await this.stop();
      console.log("HTTP server closed");

      const { closeDatabase } = await import("./db/index.js");
      await closeDatabase();
      console.log("Database connection closed");

      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  }
}
