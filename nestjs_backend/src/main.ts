import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap() {
  const logger = new Logger("Main-Application");

  // // Vulnerability 1: Hard-coded API KEY
  // const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.debug(`NestJS Server is running on Port: ${port}`);
}

bootstrap().catch(err => console.error(err));
// simulating change
