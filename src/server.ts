import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { apiRouter } from "./routes/api";

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // CORS configuration
    const corsOptions: CorsOptions = {
      origin: true,
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    // Body parsing
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Logging
    this.app.use(morgan("combined"));
  }

  private configureRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // API routes
    this.app.use("/api", apiRouter);

    // Root endpoint
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        message: "Vulnerable Express API - Testing Environment",
        version: "1.0.0",
        endpoints: {
          health: "/health",
          api: "/api",
        },
      });
    });
  }

  private configureErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.path}`,
      });
    });

    // Global error handler
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("Error:", err);
        res.status(500).json({
          error: "Internal Server Error",
          message: err.message,
        });
      },
    );
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📍 Health check: http://localhost:${this.port}/health`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default Server;
