import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneCodeController } from './phone-code.controller';
import { PhoneCodeRepository } from './phone-code.repository';
import { PhoneCodeService } from './phone-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneCodeRepository])],
  controllers: [PhoneCodeController],
  providers: [PhoneCodeService],
  exports: [],
})
export class PhoneCodeModule {}
