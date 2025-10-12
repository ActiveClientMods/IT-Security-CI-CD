import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Main-Application");

  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.debug(`NestJS Server is running on Port: ${port}`);
}
bootstrap().catch(err => console.error(err));
