import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    const limit = paginationQuery.limit ?? 10;
    const page = paginationQuery.page ?? 1;

    const results = await repository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
    return results;
  }
}
