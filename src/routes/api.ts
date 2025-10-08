import axios from "axios";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import _ from "lodash";
import moment from "moment";

export interface User {
  username: string;
  password: string;
}

export const apiRouter = Router();

// Intentional vulnerability: hardcoded secret (Gitleaks will catch this)
const SECRET_KEY = "super-secret-key-12345";

// Intentional vulnerability: SQL injection prone (CodeQL will catch this)
apiRouter.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  // This is vulnerable to SQL injection if used with a real database
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  res.json({
    message: "User data",
    query: query,
    warning: "This endpoint is vulnerable to SQL injection",
  });
});

// Intentional vulnerability: JWT with weak secret
apiRouter.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as User;

  // Weak authentication (for testing purposes)
  if (username && password) {
    const token = jwt.sign(
      { username, role: "user" },
      SECRET_KEY, // Hardcoded secret
      { expiresIn: "24h" },
    );

    res.json({ token, username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Intentional vulnerability: SSRF (Server-Side Request Forgery)
apiRouter.post("/fetch-url", (req: Request, res: Response) => {
  interface Url {
    url: string;
  }
  const { url } = req.body as Url;

  // No URL validation - SSRF vulnerability
  axios
    .get(url)
    .then(response => {
      res.json({
        data: response.data as unknown,
        warning: "This endpoint is vulnerable to SSRF attacks",
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch URL",
      });
    });
});

// Intentional vulnerability: Prototype pollution using lodash
apiRouter.post("/merge-config", (req: Request, res: Response) => {
  const defaultConfig = {
    theme: "light",
    language: "en",
  };

  // Vulnerable to prototype pollution with old lodash version
  const userConfig = _.merge(
    {},
    defaultConfig,
    req.body as Record<string, unknown>,
  );

  res.json({
    config: userConfig,
    warning: "This endpoint may be vulnerable to prototype pollution",
  });
});
// Intentional vulnerability: XXE (XML External Entity)
apiRouter.post("/parse-xml", (req: Request, res: Response) => {
  const { xml } = req.body as { xml: string };

  res.json({
    message: "XML parsing endpoint",
    received: xml,
    warning:
      "This endpoint would be vulnerable to XXE if XML parsing was implemented",
  });
});
// Intentional vulnerability: Command injection
apiRouter.post("/ping", (req: Request, res: Response) => {
  const { host } = req.body as { host: string };

  // This would be vulnerable to command injection if exec was used
  res.json({
    message: "Ping endpoint",
    host: host,
    warning:
      "This endpoint would be vulnerable to command injection if shell execution was implemented",
  });
});
// Test endpoint for deprecated package usage
apiRouter.get("/time", (_req: Request, res: Response) => {
  const currentTime: string = moment().format("YYYY-MM-DD HH:mm:ss");

  res.json({
    time: currentTime,
    warning: "moment.js is deprecated, consider using date-fns or dayjs",
  });
});

// Endpoint with sensitive data exposure
apiRouter.get("/debug", (_req: Request, res: Response) => {
  res.json({
    environment: process.env,
    warning: "This endpoint exposes sensitive environment variables",
  });
});
