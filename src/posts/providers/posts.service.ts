import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test title 1',
        content: 'Test content 1',
      },
      {
        user: user,
        title: 'Test title 2',
        content: 'Test content 2',
      },
      {
        user: user,
        title: 'Test title 3',
        content: 'Test content 3',
      },
    ];
  }
}
