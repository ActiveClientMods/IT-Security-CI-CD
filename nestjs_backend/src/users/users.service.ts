import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Vulnerability 3: SQL Injection - Unsanitized user input in query
   */

  async findUserByEmail(email: string): Promise<User> {
    // UNSAFE: Direct string concatenation in SQL query
    // Attack example: email = "' OR '1'='1' --"
    const query = `SELECT * FROM users WHERE email = '${email}'`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.usersRepository.query(query);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  /**
   * Vulnerability 3b: SQL Injection in search functionality
   * SonarQube will detect: Rule typescript:S2077
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    // UNSAFE: User input directly interpolated into SQL
    // Attack example: searchTerm = "' OR '1'='1' --"

    return await this.usersRepository.query(
      `SELECT * FROM users WHERE first_name LIKE '%${searchTerm}%' OR last_name LIKE '%${searchTerm}%'`,
    );
  }

  /**
   * Vulnerability 3c: SQL Injection in ID lookup
   * SonarQube will detect: Rule typescript:S2077
   */

  async findUserById(id: string): Promise<User> {
    // UNSAFE: Direct string concatenation with user-controlled ID
    const query = `SELECT * FROM users WHERE id = '${id}'`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.usersRepository.query(query);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  /**
   * Vulnerability 3d: SQL Injection in role filtering
   * SonarQube will detect: Rule typescript:S2077
   */
  async findUsersByRole(role: string): Promise<User[]> {
    // UNSAFE: Unsanitized role parameter
    // Attack example: role = "admin' OR '1'='1"

    return await this.usersRepository.query(
      `SELECT * FROM users WHERE role = '${role}'`,
    );
  }

  /**
   * SECURE ALTERNATIVE (commented out - for reference only)
   * This is how you SHOULD implement these methods securely
   */

  // async findUserByEmailSecure(email: string): Promise<User | null> {
  //   return await this.usersRepository.findOne({ where: { email } });
  // }

  // async searchUsersSecure(searchTerm: string): Promise<User[]> {
  //   return await this.usersRepository
  //     .createQueryBuilder('user')
  //     .where('user.firstName LIKE :term OR user.lastName LIKE :term', {
  //       term: `%${searchTerm}%`,
  //     })
  //     .getMany();
  // }

  // async findUserByIdSecure(id: string): Promise<User | null> {
  //   return await this.usersRepository.findOne({ where: { id } });
  // }

  // async findUsersByRoleSecure(role: string): Promise<User[]> {
  //   return await this.usersRepository.find({ where: { role } });
  // }
}
