import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';

@Injectable()
export class HelperService {
  private readonly logger = new Logger(HelperService.name);

  async getEntityFields(
    entityRepository: Repository<any>,
    unnecessaryFields: string[],
    allFields: boolean,
    isAttributes: boolean,
  ): Promise<string[]> {
    try {
      const entityMetadata = entityRepository.metadata;
      let attributes: string[] = [];
      const columns = entityMetadata.columns;

      let activeFields: string[] = [];
      const notUpdatedFields = ['createdAt', 'updatedAt'];

      if (!allFields) {
        activeFields = activeFields.concat(notUpdatedFields);
      }

      activeFields = activeFields.concat(unnecessaryFields);

      for (const column of columns) {
        if (!activeFields.includes(column.propertyName)) {
          attributes.push(column.propertyName);
        }
      }

      if (isAttributes) {
        const datesList = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
        attributes.forEach((attr, index) => {
          if (datesList.includes(attr)) {
            attributes[index] = `${attr} * 1000`;
          }
        });
      }

      return attributes;
    } catch (e) {
      this.logger.error(`Error during get entity fields: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
