import { Controller, Get, Query } from "@nestjs/common";
import { exec } from "child_process";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // // Vulnerability 3: Command Injection
  // @Get("exec")
  // executeCommand(@Query("cmd") command: string): string {
  //   exec(command, (error: Error | null, stdout: string) => {
  //     console.log(stdout);
  //   });
  //   return `Executing command: ${command}`;
  // }
}
