import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

/**
 * Users Controller
 * Exposes vulnerable endpoints for SQL Injection demonstration
 */
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Vulnerable endpoint: Find user by email
   * Example: GET /users/by-email?email=test@example.com
   * Attack: GET /users/by-email?email=' OR '1'='1
   */
  @Get("by-email")
  async findByEmail(@Query("email") email: string): Promise<User> {
    if (!email) {
      throw new HttpException(
        "Email parameter is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // This calls the vulnerable service method
      const user = await this.usersService.findUserByEmail(email);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      return user;
    } catch {
      throw new HttpException(
        "Error finding user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Vulnerable endpoint: Search users by name
   * Example: GET /users/search?term=John
   * Attack: GET /users/search?term=' OR '1'='1' --
   */
  @Get("search")
  async searchUsers(@Query("term") searchTerm: string): Promise<User[]> {
    if (!searchTerm) {
      throw new HttpException(
        "Search term is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // This calls the vulnerable service method
      return await this.usersService.searchUsers(searchTerm);
    } catch {
      throw new HttpException(
        "Error searching users",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Vulnerable endpoint: Get user by ID with raw SQL
   * Example: GET /users/1
   * Attack: GET /users/1' OR '1'='1
   */
  @Get(":id")
  async findById(@Param("id") id: string): Promise<User> {
    try {
      // This calls another vulnerable service method
      const user = await this.usersService.findUserById(id);

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      return user;
    } catch {
      throw new HttpException(
        "Error finding user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
