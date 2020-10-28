import { CommandEntity } from 'apps/api/src/core/command/command.entity';
import { DialogEntity } from 'apps/api/src/core/dialog/dialog.entity';
import { AccountEntity } from 'apps/api/src/core/account/account.entity';

import * as config from 'config';
import { ConnectionOptions } from 'typeorm';
import { PhoneCodeEntity } from 'apps/api/src/core/phone-code/phone-code.entity';

const dbConfig = config.get('DATABASE');

export const ApiEntities = [
  CommandEntity,
  AccountEntity,
  DialogEntity,
  PhoneCodeEntity,
];

export const DatabaseConfig: ConnectionOptions = {
  type: dbConfig.TYPE,
  url: dbConfig.URL,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: dbConfig.SYNCHRONIZE,
};
