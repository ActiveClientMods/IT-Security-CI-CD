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

  // SECURITY ISSUE: SQL Injection vulnerability (will be detected by CodeQL)
  @Get("user")
  getUserData(@Query("id") userId: string): string {
    // Vulnerable to SQL injection - directly using user input
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return `Executing query: ${query}`;
  }

  // SECURITY ISSUE: Command Injection vulnerability
  @Get("exec")
  executeCommand(@Query("cmd") command: string): string {
    // Vulnerable to command injection
    exec(command, (error: Error | null, stdout: string) => {
      console.log(stdout);
    });
    return `Executing command: ${command}`;
  }
}
