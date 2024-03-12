import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, errors?: string[], stack?: string) {
    super({ success: false, errors, stack }, status);
  }
}
