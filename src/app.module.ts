import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        // entities: [User, Post], -> -> No need as we defiend autoLoadEntities
        autoLoadEntities: true,
        synchronize: true,
        port: 5432,
        username: 'postgres',
        password: '1234',
        host: 'localhost',
        database: 'nestjs-blog',
      }),
    }),
    TagsModule,
    MetaOptionsModule,

    // We'll convert this to async as we're planning to get these database configurations from an .env file.
    // TypeOrmModule.forRoot({
    //   // common configurations
    //   type: 'postgres',
    //   entities: [],
    //   // Synchronize should only be used in development mode.
    //   // This automatically creates database schema in the application. So it can be destructive in production mode.
    //   synchronize: true,
    //   // postgres specific configurations
    //   port: 5432,
    //   username: 'postgres',
    //   password: '1234',
    //   host: 'localhost',
    //   database: 'nestjs-blog',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
