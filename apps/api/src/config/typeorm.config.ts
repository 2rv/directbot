import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { AccountEntity } from '../core/account/account.entity';
import { CommandEntity } from '../core/command/command.entity';
import { DialogEntity } from '../core/dialog/dialog.entity';
import { PhoneCodeEntity } from '../core/phone-code/phone-code.entity';

const dbConfig = config.get('DATABASE');

export const ApiEntities = [
  PhoneCodeEntity,
  CommandEntity,
  AccountEntity,
  DialogEntity,
];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.TYPE,
  url: process.env.DATABASE_URL || dbConfig.URL,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.SYNCHRONIZE,
};
