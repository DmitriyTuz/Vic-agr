import { Module } from '@nestjs/common';
import { ElasticSearchController } from '@src/elastic-search/elastic-search.controller';
import { ElasticSearchService } from '@src/elastic-search/elastic-search.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService],

  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_NODE'),
        auth: {
          username: configService.get('ELASTIC_USERNAME'),
          password: configService.get('ELASTIC_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
