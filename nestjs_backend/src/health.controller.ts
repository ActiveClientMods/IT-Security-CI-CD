import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get()
  getHello(): string {
    return "Success";
  }
}
