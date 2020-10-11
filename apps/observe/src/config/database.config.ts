import { CommandEntity } from 'apps/api/src/core/command/command.entity';
import { DialogEntity } from 'apps/api/src/core/dialog/dialog.entity';
import { UserEntity } from 'apps/api/src/core/user/user.entity';

import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

const dbConfig = config.get('DATABASE');

export const ApiEntities = [CommandEntity, UserEntity, DialogEntity];

export const DatabaseConfig: ConnectionOptions = {
  type: dbConfig.TYPE,
  url: dbConfig.URL,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: dbConfig.SYNCHRONIZE,
};
