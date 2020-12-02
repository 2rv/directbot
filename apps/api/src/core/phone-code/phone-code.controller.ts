import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { SendPhoneCodeDto } from './dto/send-phone-code.dto';
import { PhoneCodeService } from './phone-code.service';

@Controller('phone-code')
export class PhoneCodeController {
  constructor(private phoneCodeService: PhoneCodeService) {}

  @Post('/send')
  async sendPhoneCode(
    @Body(ValidationPipe) sendPhoneCodeDto: SendPhoneCodeDto,
  ): Promise<void> {
    return this.phoneCodeService.sendPhoneCode(sendPhoneCodeDto);
  }

  @Post('/recive-from-api')
  async recivePhoneCodeFromApi(@Body() body, @Query() query): Promise<void> {
    return this.phoneCodeService.recivePhoneCodeFromApi(body, query);
  }
}
