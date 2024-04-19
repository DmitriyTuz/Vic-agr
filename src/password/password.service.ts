import { Injectable } from '@nestjs/common';
import * as generator from 'generate-password';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {

  createPassword = (): string => {
    return generator.generate({
      length: 10,
      numbers: true
    });
  };

  async hashPassword(password) {
    try {
      let salt: any = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      throw (err);
    }
  };
}
