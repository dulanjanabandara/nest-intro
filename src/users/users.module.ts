import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { ConfigModule } from '@nestjs/config';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    // Adding module level guard to whole module
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // },
  ],
  // You cannot export controllers. You can only export providers
  exports: [UsersService],
  // imports: [forwardRef(() => AuthModule)],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    // ConfigModule.forFeature(profileConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
