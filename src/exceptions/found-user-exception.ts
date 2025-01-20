import {HttpException, HttpStatus} from "@nestjs/common";

interface Error {
  message?: never;
  error?: never;
  createdAt?: never;
  [key: string]: string;
}

export class FoundUserException extends HttpException {
  constructor(phone: string, error: Error = null) {
    super(
        {
          message: `User with phone ${phone} already exists`,
          error: 'found_user_exception',
          createdAt: new Date(),
          status: HttpStatus.FOUND,
          ... error
      },
      HttpStatus.FOUND,
    );
  }
}