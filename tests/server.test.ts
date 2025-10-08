import request from "supertest";
import Server from "../src/server";

describe("Express Server", () => {
  let server: Server;
  let app: any;

  beforeAll(() => {
    server = new Server(3001);
    app = server.getApp();
  });

  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Vulnerable Express API");
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  describe("POST /api/login", () => {
    it("should return token for valid credentials", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ username: "testuser", password: "testpass" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("username", "testuser");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/api/login").send({});

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user data", async () => {
      const response = await request(app).get("/api/users/123");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("query");
    });
  });

  describe("POST /api/merge-config", () => {
    it("should merge configuration", async () => {
      const response = await request(app)
        .post("/api/merge-config")
        .send({ theme: "dark" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("config");
      expect(response.body.config).toHaveProperty("theme", "dark");
    });
  });

  describe("GET /api/time", () => {
    it("should return current time", async () => {
      const response = await request(app).get("/api/time");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("time");
    });
  });

  describe("404 handler", () => {
    it("should return 404 for non-existent route", async () => {
      const response = await request(app).get("/non-existent");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not Found");
    });
  });
});
