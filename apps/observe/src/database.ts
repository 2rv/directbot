import { DatabaseConfig } from './config/database.config';
import { ConnectionManager } from 'typeorm';

export const initDatabaseConnection = async () => {
  const connectionManager = new ConnectionManager();
  const connection = connectionManager.create(DatabaseConfig);
  await connection.connect();
};
