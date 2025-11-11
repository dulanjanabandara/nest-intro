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
} from '@nestjs/common';
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
  @Get('/:id{/:optional}')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', ParseIntPipe) limit: number | undefined,
  ) {
    console.log(typeof id);
    console.log(id);
    console.log(typeof limit);
    console.log(limit);
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

  @Post()
  public createUser(
    @Body('email') email: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(email);
    console.log(headers);
    console.log(ip);
    return 'You sent a post request to users endpoint!';
  }
}
