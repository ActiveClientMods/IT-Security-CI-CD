import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users";

const app = express();

// SECURITY: Missing security headers (no helmet)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SECURITY: CORS not configured
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // Vulnerable: Allows any origin
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Vulnerable API is running" });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version, // SECURITY: Information disclosure
  });
});

app.use("/api/users", userRoutes);

// SECURITY: Detailed error messages exposed
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack, // SECURITY: Stack trace exposure
    path: req.path,
  });
});

export default app;
// Added some new logic
