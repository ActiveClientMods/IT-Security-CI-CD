import { describe, expect, it } from "@jest/globals";
import request, { type Response } from "supertest";
import app from "../src/app";

describe("API Endpoints", () => {
  describe("GET /", () => {
    it("should return API running message", async () => {
      const response: Response = await request(app).get("/");

      expect(response.status).toBe(200);
      // use Response.type which is a typed string for content-type
      expect(response.type).toMatch(/application\/json/);
      expect(response.body).toEqual({ message: "Vulnerable API is running" });
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response: Response = await request(app).get("/health");

      expect(response.status).toBe(200);
      const body = response.body as {
        status: string;
        timestamp: string;
        uptime: number;
      };

      expect(body).toHaveProperty("status", "healthy");
      expect(body).toHaveProperty("timestamp");
      expect(typeof body.uptime).toBe("number");

      // timestamp should be a valid ISO string
      expect(() => new Date(body.timestamp)).not.toThrow();
      const ts = Date.parse(body.timestamp);
      expect(Number.isNaN(ts)).toBe(false);
    });
  });

  describe("GET /api/users/search", () => {
    it("should search users by query and return an array", async () => {
      const response: Response = await request(app)
        .get("/api/users/search")
        .query({ q: "admin" });

      expect(response.status).toBe(200);
      const results = response.body as { username: string }[];
      expect(Array.isArray(results)).toBe(true);

      // If searching for "admin" we expect at least one result with username containing "admin"
      const usernames = results.map(u => u.username);
      expect(usernames.some(n => n.includes("admin"))).toBe(true);
    });
  });

  describe("POST /api/users/login", () => {
    it("should login with valid credentials and return token + user", async () => {
      const response: Response = await request(app)
        .post("/api/users/login")
        .send({ username: "admin", password: "admin123" });

      expect(response.status).toBe(200);
      const body = response.body as {
        token: string;
        user: { id: number; username: string };
      };

      expect(typeof body.token).toBe("string");
      expect(body.token).toMatch(/^fake_jwt_token_/);

      expect(body.user).toBeDefined();
      expect(body.user).toHaveProperty("id");
      expect(body.user).toHaveProperty("username", "admin");
    });

    it("should reject invalid credentials with 401 and error payload", async () => {
      const response: Response = await request(app)
        .post("/api/users/login")
        .send({ username: "admin", password: "wrongpassword" });

      expect(response.status).toBe(401);
      const body = response.body as { error?: string };
      expect(body).toHaveProperty("error");
    });
  });
});
