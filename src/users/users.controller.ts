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
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
// import type { Request } from 'express';
// To group apis based on the modules - ApiTags
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
// A swagger decorator - Swagger decorators can be used within DTOs, controllers and also controller methods
// This one is used to group the requests based on the modules
@ApiTags('USERS')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('{/:id}')
  // Adding a description/summary to the API in swagger documentation
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  // ApiResponse is for document the api response in swagger documentation
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  // To display data about query parameters in the swagger documentation
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The page number that the API returns',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
    // console.log(typeof createUserDto);
    // console.log(createUserDto instanceof CreateUserDto);
    // return 'You sent a post request to users endpoint!';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }

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

  // To validate parameters of the request using DTO and ValidationPipe
  // @Get('{/:id}')
  // public getUsers(
  //   // Once you extract out a key-value pair, you cannot validate it with DTOs.
  //   // There could be more than one parameters in the request.
  //   // So, we have to extract the whole parameter object to validate with DTOs.
  //   @Param() getUsersParamDto: GetUsersParamDto,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  //   limit: number | undefined,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe)
  //   page: number | undefined,
  // ) {
  //   console.log(getUsersParamDto);
  //   return 'You sent a get request to users endpoint!';
  // }

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

  // To validate the body of the request using DTO and ValidationPipe (global pipe)
  // @Post()
  // public createUser(@Body() createUserDto: CreateUserDto) {
  //   console.log(typeof createUserDto);
  //   console.log(createUserDto instanceof CreateUserDto);
  //   return 'You sent a post request to users endpoint!';
  // }

  // to use partial updates with PATCH method using PatchUserDto (check partial class in the DTO file)
  // @Patch()
  // public patchUser(@Body() patchUserDto: PatchUserDto) {
  //   return patchUserDto;
  // }
}
