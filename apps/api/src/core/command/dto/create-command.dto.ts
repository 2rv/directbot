export interface CreateCommandDto {
  trigger: string;
  value: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommandDto {
  @IsNotEmpty()
  @IsString()
  trigger: string;

  @IsNotEmpty()
  @IsString()
  data: string;
}
