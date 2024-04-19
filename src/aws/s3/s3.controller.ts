import { Controller, Delete, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {S3Service} from "@src/aws/s3/s3.service";
import { File } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {ConfigService} from "@nestjs/config";


@ApiTags('S3 (AWS)')
@Controller('S3')
// @Controller('S3')
export class S3Controller {
  constructor(
      private s3Service: S3Service,
      private configService: ConfigService
  ) {}

  @Put('/upload/upload-image')
  @ApiOperation({ summary: 'Upload file to AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToS3(@UploadedFile() file: File, @Res() res: Response) {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    // const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `${Date.now()}-${file.originalname}`;

    return res.json({
      success: true,
      urlData: await this.s3Service.uploadFileToS3(file, bucketName, key),
    });
  }

  @Delete('/remove/remove-image/:key')
  @ApiOperation({ summary: 'Remove file from AWS S3' })
  @ApiParam({
    name: 'key',
    description: 'Key of the file to delete',
    required: true,
    type: 'string',
    example: '1709639721862-4.jpg',
  })
  @ApiResponse({ status: 200, description: 'deletion successful' })
  async deleteFileFromS3(@Param('key') key: string) {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    await this.s3Service.deleteFileFromS3(bucketName, key);
    return { message: 'File deleted successfully' };
  }
}
