import { IsNotEmpty, IsString } from 'class-validator';

export class SendPhoneCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
