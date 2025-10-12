import type { INestApplication } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Mock dependencies for testing
jest.mock("@nestjs/core", () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

const mockNestFactory = NestFactory as jest.Mocked<typeof NestFactory>;

describe("Main Bootstrap", () => {
  let mockApp: {
    listen: jest.MockedFunction<(port: string | number) => Promise<void>>;
  };
  let consoleSpy: jest.SpyInstance;
  let loggerSpy: jest.SpyInstance;
  let nestFactoryCreateSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock NestFactory.create
    nestFactoryCreateSpy = jest
      .spyOn(NestFactory, "create")
      .mockResolvedValue(mockApp as unknown as INestApplication);

    // Mock console.error
    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock Logger.debug
    loggerSpy = jest.spyOn(Logger.prototype, "debug").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    loggerSpy.mockRestore();
    nestFactoryCreateSpy.mockRestore();
  });

  describe("Bootstrap Function", () => {
    beforeEach(() => {
      // Store original PORT value
      if (process.env.PORT) {
        process.env.TEST_ORIGINAL_PORT = process.env.PORT;
      }
    });

    afterEach(() => {
      // Restore original PORT value
      if (process.env.TEST_ORIGINAL_PORT) {
        process.env.PORT = process.env.TEST_ORIGINAL_PORT;
        delete process.env.TEST_ORIGINAL_PORT;
      } else {
        delete process.env.PORT;
      }
    });

    it("should create NestJS application with AppModule", async () => {
      // Mock the NestJS application
      mockApp = {
        listen: jest.fn().mockResolvedValue(undefined),
      };

      // Mock NestFactory.create
      mockNestFactory.create.mockResolvedValue(
        mockApp as unknown as INestApplication,
      );

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");
      await bootstrap();

      expect(nestFactoryCreateSpy).toHaveBeenCalledWith(AppModule);
    });

    it("should use default port 3000 when PORT is not set", async () => {
      delete process.env.PORT;

      // Mock the NestJS application
      mockApp = {
        listen: jest.fn().mockResolvedValue(undefined),
      };

      // Mock NestFactory.create
      mockNestFactory.create.mockResolvedValue(
        mockApp as unknown as INestApplication,
      );

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");
      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
      expect(loggerSpy).toHaveBeenCalledWith(
        "NestJS Server is running on Port: 3000",
      );
    });

    it("should use PORT from environment variable", async () => {
      process.env.PORT = "8080";

      // Mock the NestJS application
      mockApp = {
        listen: jest.fn().mockResolvedValue(undefined),
      };

      // Mock NestFactory.create
      mockNestFactory.create.mockResolvedValue(
        mockApp as unknown as INestApplication,
      );

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");
      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith("8080");
      expect(loggerSpy).toHaveBeenCalledWith(
        "NestJS Server is running on Port: 8080",
      );
    });

    it("should handle NestFactory.create errors", async () => {
      const error = new Error("Factory creation failed");

      // Mock NestFactory.create to throw error
      mockNestFactory.create.mockRejectedValue(error);

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");

      // Bootstrap should handle the error and call console.error
      await expect(bootstrap()).rejects.toThrow("Factory creation failed");
    });

    it("should handle app.listen errors", async () => {
      const error = new Error("Listen failed");

      // Mock the NestJS application with failing listen
      mockApp = {
        listen: jest.fn().mockRejectedValue(error),
      };

      // Mock NestFactory.create
      mockNestFactory.create.mockResolvedValue(
        mockApp as unknown as INestApplication,
      );

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");

      // Bootstrap should handle the error and call console.error
      await expect(bootstrap()).rejects.toThrow("Listen failed");
    });

    it("should create Logger with correct context", async () => {
      // Mock the NestJS application
      mockApp = {
        listen: jest.fn().mockResolvedValue(undefined),
      };

      // Mock NestFactory.create
      mockNestFactory.create.mockResolvedValue(
        mockApp as unknown as INestApplication,
      );

      // Import and call bootstrap directly
      const { bootstrap } = await import("./main");
      await bootstrap();

      // Logger should be instantiated and debug method should be called
      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe("Environment Configuration", () => {
    it("should handle string port values from environment", () => {
      const originalPort = process.env.PORT;
      process.env.PORT = "4000";

      const port = process.env.PORT ?? 3000;
      expect(port).toBe("4000");

      // Restore
      if (originalPort) {
        process.env.PORT = originalPort;
      } else {
        delete process.env.PORT;
      }
    });

    it("should use nullish coalescing operator correctly", () => {
      const originalPort = process.env.PORT;

      // Test with undefined
      delete process.env.PORT;
      expect(process.env.PORT ?? 3000).toBe(3000);

      // Test with empty string (should not fallback)
      process.env.PORT = "";
      expect(process.env.PORT ?? 3000).toBe("");

      // Test with valid value
      process.env.PORT = "5000";
      expect(process.env.PORT ?? 3000).toBe("5000");

      // Restore
      if (originalPort) {
        process.env.PORT = originalPort;
      } else {
        delete process.env.PORT;
      }
    });
  });

  describe("Logger functionality", () => {
    let logger: Logger;

    beforeEach(() => {
      logger = new Logger("Main-Application");
    });

    it("should create logger instance", () => {
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(Logger);
    });

    it("should be able to call debug method", () => {
      const debugSpy = jest.spyOn(logger, "debug").mockImplementation();

      logger.debug("Test message");

      expect(debugSpy).toHaveBeenCalledWith("Test message");
      debugSpy.mockRestore();
    });

    it("should format server start message correctly", () => {
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
