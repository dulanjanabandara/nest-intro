import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// By this all the properties of CreateUserDto will be optional here.
export class PatchUserDto extends PartialType(CreateUserDto) {}
