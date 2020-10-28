import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommandDto {
  @IsNotEmpty()
  @IsString()
  data: string;
}
