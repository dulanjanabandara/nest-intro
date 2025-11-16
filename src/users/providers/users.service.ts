import { forwardRef, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
// import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * The circular dependency is handled in the constructor
   */
  // constructor(
  //   @Inject(forwardRef(() => AuthService))
  //   private readonly authService: AuthService,
  // ) {}

  constructor(
    /**
     * Injecting userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // No need of await keyword as this step does not save the item to the database. We can do any other operations here before storing the item to the database
    let newUser = this.usersRepository.create(createUserDto);
    // saving to the database
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  /**
   * The method to get all users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // const isAuth = this.authService.isAuth();
    // console.log(isAuth);

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
