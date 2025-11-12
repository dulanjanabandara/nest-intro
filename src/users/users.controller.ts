import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.fto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
// import type { Request } from 'express';

@Controller('users')
export class UsersController {
  // To get the whole parameter object of the request
  // @Get('/:id{/:optional}')
  // public getUsers(@Param() params: any, @Query() query: any) {
  //   console.log(params);
  //   console.log(query);
  //   return 'You sent a get request to users endpoint!';
  // }

  // To get specific parameters of the request
  // @Get('{/:id}') // Built-in pipes starts with "Parse" keywords thinks that these parameters are not optional.
  // So, we cannot validate optional parameters with built-in pipes starts with the word "parse".
  // @Get('/:id{/:optional}')
  // public getUsers(
  //   @Param('id', ParseIntPipe) id: number | undefined,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  //   limit: number | undefined,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe)
  //   page: number | undefined,
  // ) {
  //   console.log(id);
  //   console.log(limit);
  //   console.log(page);
  //   return 'You sent a get request to users endpoint!';
  // }

  @Get('{/:id}')
  public getUsers(
    // Once you extract out key-value pair, you cannot validate it with DTOs.
    // There could be more than one parameters in the request.
    // So, we have to extract the whole parameter object to validate with DTOs.
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number | undefined,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number | undefined,
  ) {
    console.log(getUsersParamDto);
    return 'You sent a get request to users endpoint!';
  }

  // To get the whole body of the request
  // @Post()
  // public createUser(@Body() body: any) {
  //   // do not do this way!
  //   // public createUser(@Req() req: Request) {
  //   console.log(body);
  //   return 'You sent a post request to users endpoint!';
  // }

  // Other decorators to get specific data from the request (headers, ip, etc.)
  // @Post()
  // public createUser(
  //   @Body('email') email: any,
  //   @Headers() headers: any,
  //   @Ip() ip: any,
  // ) {
  //   console.log(email);
  //   console.log(headers);
  //   console.log(ip);
  //   return 'You sent a post request to users endpoint!';
  // }

  // To validate the body of the request using DTO and ValidationPipe
  // @Post()
  // public createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  //   console.log(createUserDto);
  //   return 'You sent a post request to users endpoint!';
  // }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    // console.log(typeof createUserDto);
    console.log(createUserDto instanceof CreateUserDto);
    return 'You sent a post request to users endpoint!';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
