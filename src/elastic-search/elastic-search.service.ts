import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class ElasticSearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(indexName: string) {
    await this.elasticsearchService.indices.create({ index: indexName });
    return { message: `Index ${indexName} created successfully` };
  }

  async importDataFromCSV(filePath: string, indexName: string) {
    const documents = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        documents.push({ index: { _index: indexName } });
        documents.push(data);
      })
      .on('end', async () => {
        await this.elasticsearchService.bulk({ body: documents });
      });
  }

  async searchByField(indexName: string, field: string, query: string) {
    const body = await this.elasticsearchService.search({
      index: indexName,
      body: {
        query: {
          match: {
            [field]: query,
          },
        },
      },
    });

    return body.hits.hits.map((hit) => hit._source);
  }
}
