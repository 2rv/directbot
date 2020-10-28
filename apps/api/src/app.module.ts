import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CommandModule } from './core/command/command.module';
import { PhoneCodeModule } from './core/phone-code/phone-code.module';

@Module({
  providers: [],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PhoneCodeModule,
    CommandModule,
  ],
})
export class AppModule {}
