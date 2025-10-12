import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(healthController).toBeDefined();
  });

  describe("getHello", () => {
    it('should return "Success"', () => {
      expect(healthController.getHello()).toBe("Success");
    });
  });
});
