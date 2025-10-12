import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("HealthController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/health (GET)", async () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect("Success");
  });

  it("should return text/html content type", async () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect("Content-Type", /html/);
  });
});
