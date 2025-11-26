import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
// import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
    private readonly usersRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      // Might save the details of the exception
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException('User already exists with this email.');
    }

    // No need of await keyword as this step does not save the item to the database. We can do any other operations here before storing the item to the database
    let newUser = this.usersRepository.create(createUserDto);

    try {
      // saving to the database
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

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
    // const environment = this.configService.get<string>('S3_BUCKET');
    // this.logger.log(`S3_BUCKET environment: ${environment}`);
    // return [
    //   { firstName: 'John', lastName: 'Doe', email: 'john@joe.com' },
    //   { firstName: 'Alice', lastName: 'Doe', email: 'alice@doe.com' },
    // ];

    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist.',
        fileName: 'users.service.ts',
        lineNumber: 100,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error('Occured because the API was permemanently moved'),
        description: 'Occured because the API was permemanently moved',
      },
    );
  }

  /**
   * Finding a single user by the ID of the user
   */
  public async findOneById(id: number) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    return user;
  }
}
