import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

config({
  path:
      configService.get('NODE_ENV') === 'production'
          ? join(process.cwd(), '.production.env')
          : configService.get('NODE_ENV') === 'test'
          ? join(process.cwd(), '.test.env')
          : join(process.cwd(), '.development.env'),
});

const options = (): DataSourceOptions => {
  const url = configService.get('POSTGRES_URL');
  if (!url) {
    throw new Error('Database URL is empty');
  }
  return {
    url,
    type: 'postgres',
    schema: 'public',
    ssl: configService.get<boolean>('POSTGRES_SSL'),
    logging: configService.get('IS_LOG') === 'true',
    entities: [],
    migrations: [join(process.cwd(), 'dist', 'migrations', '**', '*{.ts,.js}')],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    synchronize: false,
  };
};

export const appDataSource = new DataSource(options());