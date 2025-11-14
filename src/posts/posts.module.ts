import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],

  // You never import a service, it should always be a module that is imported.
  // Nest.js will only import the services/providers that are explicitly exported from users module.
  imports: [UsersModule],
})
export class PostsModule {}
