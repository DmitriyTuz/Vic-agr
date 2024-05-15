import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

// if (!process.env.NODE_ENV) {
//   console.log(! 1)
//   config({
//     path:
//         process.env.NODE_ENV === 'production'
//             ? join(process.cwd(), '.production.env')
//             : process.env.NODE_ENV === 'test'
//             ? join(process.cwd(), '.test.env')
//             : join(process.cwd(), '.development.env'),
//   });
// }

// config({
//   path:
//     configService.get('NODE_ENV') === 'production'
//       ? join(process.cwd(), '.production.env')
//       : configService.get('NODE_ENV') === 'test'
//       ? join(process.cwd(), '.test.env')
//       : join(process.cwd(), '.development.env'),
// });

config({
  path:
      process.env.NODE_ENV === 'production'
          ? join(process.cwd(), '.production.env')
          : process.env.NODE_ENV === 'test'
          ? join(process.cwd(), '.test.env')
          : join(process.cwd(), '.development.env'),
});

const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = process.env.POSTGRES_URL;
  // const url = configService.get('POSTGRES_URL');
  console.log('!!! url = ', url);
  console.log('!!! process.env.NODE_ENV = ', process.env.NODE_ENV);
  console.log('!!! join(process.cwd(), \'.test.env\') = ', join(process.cwd(), '.test.env'));

  if (!url) {
    throw new Error('Database URL is empty');
  }
  return {
    url,
    type: 'postgres',
    schema: 'public',
    ssl: configService.get<boolean>('POSTGRES_SSL'),
    logging: configService.get('IS_LOG') === 'true',
    entities: [join(process.cwd(), /*'dist',*/ 'src', 'entities', '**', '*.entity.{ts,js}')],
    migrations: [join(process.cwd(), 'dist', 'migrations', '**', '*{.ts,.js}')],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    synchronize: false,
  };
};

export const appDataSource = new DataSource(options());
