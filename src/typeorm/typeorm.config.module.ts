import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATA_SOURCE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DataSource => {
        const options: DataSourceOptions = {
          url: configService.get<string>('POSTGRES_URL'),
          type: 'postgres',
          schema: 'public',
          ssl: configService.get<boolean>('POSTGRES_SSL'),
          logging: configService.get<boolean>('IS_LOG'),
          entities: [configService.get<string>('ENTITIES_PATH')],
          migrations: [configService.get<string>('MIGRATIONS_PATH')],
          migrationsRun: false,
          migrationsTableName: 'migrations',
          synchronize: false,
        };

        return new DataSource(options);
      },
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class TypeOrmConfigModule {}