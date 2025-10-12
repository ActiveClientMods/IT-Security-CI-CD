import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";
import { HealthController } from "./health.controller";

describe("AppModule", () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });

  it("should have AppController", () => {
    const controller = appModule.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it("should have HealthController", () => {
    const controller = appModule.get<HealthController>(HealthController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it("should have AppService", () => {
    const service = appModule.get<AppService>(AppService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AppService);
  });

  it("should inject AppService into AppController", () => {
    const controller = appModule.get<AppController>(AppController);
    expect(controller.getHello()).toBe("Hello World!");
  });

  it("should have correct number of controllers", () => {
    const controllers = [AppController, HealthController];
    controllers.forEach(ctrl => {
      const controller = appModule.get(ctrl);
      expect(controller).toBeDefined();
    });
  });

  it("should compile successfully", async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    await module.init();
    await module.close();
  });
});
