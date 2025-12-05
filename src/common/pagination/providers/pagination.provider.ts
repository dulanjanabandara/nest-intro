import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const limit = paginationQuery.limit ?? 10;
    const page = paginationQuery.page ?? 1;

    const results = await repository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    // Create request URLs for pagination links
    // const baseUrl = `${this.request.protocol}://${this.request.get('host')}${
    //   this.request.path
    // }`;
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${page}&limit=${limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${previousPage}&limit=${limit}`,
      },
    };

    return finalResponse;
  }
}
