import { Injectable } from '@nestjs/common';
import * as generator from 'generate-password';

@Injectable()
export class PasswordService {

  createPassword = (): string => {
    return generator.generate({
      length: 10,
      numbers: true
    });
  };
}
