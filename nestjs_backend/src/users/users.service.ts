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
   * VULNERABILITY: SQL Injection via string concatenation
   * SonarCloud Rule: typescript:S2077
   * Severity: Critical
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    // Explicitly vulnerable - direct string interpolation
    const sqlQuery = "SELECT * FROM users WHERE email = '" + email + "'";

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.usersRepository.query(sqlQuery);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0];
  }

  /**
   * VULNERABILITY: SQL Injection via template literal
   * SonarCloud Rule: typescript:S2077
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    // Explicitly vulnerable - template literal with user input
    const sql = `SELECT * FROM users WHERE first_name LIKE '%${searchTerm}%' OR last_name LIKE '%${searchTerm}%'`;

    return await this.usersRepository.query(sql);
  }

  /**
   * VULNERABILITY: SQL Injection in WHERE clause
   * SonarCloud Rule: typescript:S2077
   */
  async findUserById(userId: string): Promise<User | undefined> {
    // String concatenation vulnerability
    const query = "SELECT * FROM users WHERE id = " + userId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const users = await this.usersRepository.query(query);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return users[0];
  }

  /**
   * VULNERABILITY: SQL Injection in role-based query
   * SonarCloud Rule: typescript:S2077
   */
  async getUsersByRole(role: string): Promise<User[]> {
    // Template literal vulnerability

    return await this.usersRepository.query(
      `SELECT id, email, first_name, last_name, role FROM users WHERE role = '${role}'`,
    );
  }

  /**
   * VULNERABILITY: SQL Injection with ORDER BY
   * SonarCloud Rule: typescript:S2077
   */
  async getUsersSorted(sortColumn: string): Promise<User[]> {
    // Dangerous: user controls ORDER BY clause
    const sortQuery = "SELECT * FROM users ORDER BY " + sortColumn;

    return await this.usersRepository.query(sortQuery);
  }

  /**
   * VULNERABILITY: SQL Injection in UPDATE statement
   * SonarCloud Rule: typescript:S2077
   */
  async updateUserEmail(userId: string, newEmail: string): Promise<void> {
    // Both parameters are vulnerable
    const updateSql = `UPDATE users SET email = '${newEmail}' WHERE id = '${userId}'`;
    await this.usersRepository.query(updateSql);
  }

  /**
   * VULNERABILITY: SQL Injection in DELETE statement
   * SonarCloud Rule: typescript:S2077
   */
  async deleteUserByEmail(email: string): Promise<void> {
    // Dangerous DELETE operation
    const deleteSql = "DELETE FROM users WHERE email = '" + email + "'";
    await this.usersRepository.query(deleteSql);
  }

  // ============================================
  // SECURE ALTERNATIVES (commented for reference)
  // ============================================

  /*
  // SECURE: Using TypeORM query builder with parameters
  async findUserByEmailSecure(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { email } 
    });
  }

  // SECURE: Using query builder with parameters
  async searchUsersSecure(searchTerm: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.firstName LIKE :term OR user.lastName LIKE :term', {
        term: `%${searchTerm}%`,
      })
      .getMany();
  }

  // SECURE: Using parameterized query
  async findUserByIdSecure(userId: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { id: userId } 
    });
  }

  // SECURE: Using repository method
  async getUsersByRoleSecure(role: string): Promise<User[]> {
    return await this.usersRepository.find({ 
      where: { role } 
    });
  }

  // SECURE: Using query builder for complex queries
  async updateUserEmailSecure(userId: string, newEmail: string): Promise<void> {
    await this.usersRepository.update(
      { id: userId },
      { email: newEmail }
    );
  }
  */
}
