import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'typeorm/driver/Query';
import { SendPhoneCodeDto } from './dto/send-phone-code.dto';
import { ErrorType } from './enum/error.enum';
import { PhoneCodeRepository } from './phone-code.repository';

@Injectable()
export class PhoneCodeService {
  constructor(
    @InjectRepository(PhoneCodeRepository)
    private phoneCodeRepository: PhoneCodeRepository,
  ) {}

  async sendPhoneCode(sendPhoneCode: SendPhoneCodeDto): Promise<void> {
    const code = await this.phoneCodeRepository.findOne({
      where: { value: null },
      order: { createDate: 'DESC' },
    });

    if (!code) {
      throw new BadRequestException(ErrorType.ACTUAL_PHONE_CODE_NOT_FOUND);
    }

    code.value = sendPhoneCode.code;

    await code.save();
  }

  async recivePhoneCodeFromApi(body: Body, query: Query) {
    console.log(body, query);
  }
}
