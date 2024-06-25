import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { ElasticSearchService } from '@src/elastic-search/elastic-search.service';
// import { AllExceptionsFilter } from '@src/exeption-filters/exception.filter';
import { ApiOperation, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

// @UseFilters(AllExceptionsFilter)
@ApiTags('Elastic Search')
@Controller('elastic-search')
export class ElasticSearchController {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}

  // @Get(':text')
  // async searchMessagesByText(@Param('text') text: string): Promise<any[]> {
  //   return this.elasticsearchService.searchMessagesByText(text);
  // }

  @Post('create-index')
  @ApiOperation({ summary: 'create new index in elastic search' })
  @ApiBody({
    description: 'Name of the index to create must be string',
    type: String,
    examples: {
      example1: {
        value: { indexName: 'messages' },
      },
    },
  })
  async createIndex(@Body('indexName') indexName: string) {
    return await this.elasticSearchService.createIndex(indexName);
  }

  @Post('import')
  @ApiOperation({ summary: 'import data from csv file to elastic search' })
  @ApiBody({
    description: 'filePath and indexName must be string',
    type: String,
    examples: {
      example1: {
        value: { filePath: 'your path to csv file', indexName: 'messages' },
      },
    },
  })
  async importDataFromCSV(@Body() data: { filePath: string; indexName: string }) {
    const { filePath, indexName } = data;
    await this.elasticSearchService.importDataFromCSV(filePath, indexName);
    return { message: `Data imported to ${indexName} index successfully` };
  }

  @Get('search/:indexName/:field/:query')
  @ApiOperation({ summary: 'search in elastic search by field and its specified value' })
  @ApiParam({ name: 'indexName', description: 'Name of the index to search in', example: 'messages' })
  @ApiParam({ name: 'field', description: 'Field to search in', example: 'text' })
  @ApiParam({ name: 'query', description: 'Search query', example: 'Hello !' })
  async searchByField(
    @Param('indexName') indexName: string,
    @Param('field') field: string,
    @Param('query') query: string,
  ) {
    const result = await this.elasticSearchService.searchByField(indexName, field, query);
    return result;
  }
}
