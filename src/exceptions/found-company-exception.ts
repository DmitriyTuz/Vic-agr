import {HttpException, HttpStatus} from "@nestjs/common";

interface Error {
  message?: never;
  error?: never;
  createdAt?: never;
  [key: string]: string;
}

export class FoundCompanyException extends HttpException {
  constructor(name: string, error: Error = null) {
    super(
        {
          message: `Company with name ${name} already exists`,
          error: 'found_company_exception',
          createdAt: new Date(),
          status: HttpStatus.FOUND,
          ... error
        },
        HttpStatus.FOUND,
    );
  }
}