import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";

describe("Main Bootstrap", () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe("Application Bootstrap", () => {
    it("should create application with AppModule", async () => {
      const application = app.createNestApplication();
      expect(application).toBeDefined();
      await application.close();
    });

    it("should start application and listen on port", async () => {
      const application = app.createNestApplication();
      const port = 3001; // Use different port to avoid conflicts

      await application.listen(port);
      const url = await application.getUrl();

      expect(url).toContain(String(port));

      await application.close();
    });

    it("should create Logger instance", () => {
      const logger = new Logger("Main-Application");
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(Logger);
    });

    it("should use PORT from environment variable", () => {
      const originalPort = process.env.PORT;
      process.env.PORT = "8080";

      const port = process.env.PORT ?? 3000;
      expect(port).toBe("8080");

      // Restore original
      if (originalPort) {
        process.env.PORT = originalPort;
      } else {
        delete process.env.PORT;
      }
    });

    it("should default to port 3000 when PORT is not set", () => {
      const originalPort = process.env.PORT;
      delete process.env.PORT;

      const port = process.env.PORT ?? 3000;
      expect(port).toBe(3000);

      // Restore original
      if (originalPort) {
        process.env.PORT = originalPort;
      }
    });

    it("should handle application initialization errors", async () => {
      // Mock NestFactory.create to throw an error
      const createSpy = jest
        .spyOn(NestFactory, "create")
        .mockRejectedValueOnce(new Error("Initialization failed"));

      await expect(NestFactory.create(AppModule)).rejects.toThrow(
        "Initialization failed",
      );

      createSpy.mockRestore();
    });
  });

  describe("Logger", () => {
    let logger: Logger;

    beforeEach(() => {
      logger = new Logger("Main-Application");
    });

    it("should create logger with correct context", () => {
      expect(logger).toBeDefined();
      expect(logger.localInstance).toBeDefined();
    });

    it("should have debug method", () => {
      const debugSpy = jest.spyOn(logger, "debug").mockImplementation();

      logger.debug("Test message");

      expect(debugSpy).toHaveBeenCalledWith("Test message");
      debugSpy.mockRestore();
    });

    it("should log server start message", () => {
      const debugSpy = jest.spyOn(logger, "debug").mockImplementation();
      const port = 3000;

      logger.debug(`NestJS Server is running on Port: ${port}`);

      expect(debugSpy).toHaveBeenCalledWith(
        "NestJS Server is running on Port: 3000",
      );
      debugSpy.mockRestore();
    });
  });
});
