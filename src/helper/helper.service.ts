import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityMetadata, Repository } from 'typeorm';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import _ from 'underscore';

interface ColumnMetadata {
  propertyName: string;
}

@Injectable()
export class HelperService {
  private readonly logger: Logger = new Logger(HelperService.name);

  async getEntityFields(
    entityRepository: Repository<any>,
    unnecessaryFields: string[],
    allFields: boolean,
    isAttributes: boolean,
  ): Promise<string[]> {
    try {
      const entityMetadata: EntityMetadata = entityRepository.metadata;
      const columns: ColumnMetadata[] = entityMetadata.columns;

      let activeFields: string[] = [];
      const notUpdatedFields: string[] = ['id', 'createdAt', 'updatedAt'];

      if (!allFields) {
        activeFields = activeFields.concat(notUpdatedFields);
      }

      activeFields = activeFields.concat(unnecessaryFields);

      let attributes: string[] = columns
        .filter((column) => !activeFields.includes(column.propertyName))
        .map((column) => column.propertyName);

      if (isAttributes) {
        const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];

        attributes = attributes.map((attr) => {
          if (datesList.includes(attr)) {
            return `${attr} * 1000`;
          }
          return attr;
        });
      }

      // console.log('!!! attributes = ', attributes);

      // for (const column of columns) {
      //   if (!activeFields.includes(column.propertyName)) {
      //     attributes.push(column.propertyName);
      //   }
      // }



      // if (isAttributes) {
      //   const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
      //   attributes.forEach((attr, index) => {
      //     if (datesList.includes(attr)) {
      //       attributes[index] = `${attr} * 1000`;
      //     }
      //   });
      // }

      // if (isAttributes) {
      //   const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
      //   attributes = attributes.map((attr) => {
      //     if (datesList.includes(attr)) {
      //       return `${attr} * 1000`;
      //     }
      //     return attr;
      //   });
      // }

      return attributes;
    } catch (e) {
      this.logger.error(`Error during get entity fields: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  getModelData(modelFields, modelData) {
    try {
      return _.pick(modelData, ...modelFields);
    } catch (err) {
      throw (err);
    }
  }
}
