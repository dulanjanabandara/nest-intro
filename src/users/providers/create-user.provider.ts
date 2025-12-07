import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { UsersService } from './users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hadhingProvider: HashingProvider,
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hadhingProvider.hashPassword(createUserDto.password),
    });

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
}
