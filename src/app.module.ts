import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
// import { appConfig } from './config/app.config';
import { PaginationModule } from './common/pagination/pagination.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
    }),
    // Before config namespacing
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   // envFilePath: ['.env.development'],
    //   envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    //   load: [appConfig],
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // entities: [User, Post], -> -> No need as we defiend autoLoadEntities
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
        // port: configService.get<number>('DATABASE_PORT'),
        // username: configService.get<string>('DATABASE_USER'),
        // password: configService.get<string>('DATABASE_PASSWORD'),
        // host: configService.get<string>('DATABASE_HOST'),
        // database: configService.get<string>('DATABASE_NAME'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.name'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,

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
