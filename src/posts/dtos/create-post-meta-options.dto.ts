import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaOptions {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
