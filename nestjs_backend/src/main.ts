import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// SECURITY ISSUE: Hardcoded credentials (will be detected by Gitleaks)
const DB_PASSWORD = "MySecretP@ssw0rd123!";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

console.log(AWS_SECRET_KEY);

export async function bootstrap() {
  const logger = new Logger("Main-Application");

  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.debug(`NestJS Server is running on Port: ${port}`);
  // Using hardcoded credentials - BAD PRACTICE!
  logger.warn(`Database password: ${DB_PASSWORD.substring(0, 3)}***`);
}

bootstrap().catch(err => console.error(err));
