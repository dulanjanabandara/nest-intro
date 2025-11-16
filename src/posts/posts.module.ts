import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],

  // You never import a service, it should always be a module that is imported.
  // Nest.js will only import the services/providers that are explicitly exported from users module.
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
    MetaOption,
  ],
})
export class PostsModule {}
