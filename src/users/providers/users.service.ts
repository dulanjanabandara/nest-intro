import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * The circular dependency is handled in the constructor
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * The method to get all users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      { firstName: 'John', lastName: 'Doe', email: 'john@joe.com' },
      { firstName: 'Alice', lastName: 'Doe', email: 'alice@doe.com' },
    ];
  }

  /**
   * Finding a single user by the ID of the user
   */
  public findOneById(id: string) {
    return {
      id: 1234,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@joe.com',
    };
  }
}
