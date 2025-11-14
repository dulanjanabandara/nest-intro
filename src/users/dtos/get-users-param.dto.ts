import { IsInt, IsOptional } from 'class-validator';
// To convert one type to another type during validation
// For example parameter 'id' comes as a string from the request and we
import { Type } from 'class-transformer';
// Adding swagger decorators to describe the API endpoint properties - in this case the 'id'
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get user with a specific id',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
