import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @Optional()
  @IsPositive()
  // @Type(() => Number) // Not needed if "enableImplicitConversion" is set to true in ValidationPipe
  limit?: number = 10;

  @Optional()
  @IsPositive()
  // @Type(() => Number) // Not needed if "enableImplicitConversion" is set to true in ValidationPipe
  page?: number = 1;
}
