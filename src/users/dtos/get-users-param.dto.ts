import { IsInt, IsOptional } from 'class-validator';

// To convert one type to another type during validation
// For example parameter 'id' comes as a string from the request and we
import { Type } from 'class-transformer';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
