import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  // @IsString()
  // @IsNotEmpty()
  // key: string;
  // @IsNotEmpty()
  // value: any;

  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
  // metaValue: JSON; // this would also fine
}
