import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CustomHttpException} from "@src/exceptions/сustomHttp.exception";

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetEmail(newPass: string): Promise<void> {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 465,
        auth: {
          user: 'dmitriytuz123@gmail.com',
          pass: 'poqxfjnvuztqjlqv',
        },
        tls: {
          rejectUnauthorized: true
        }
      });

      await transporter.sendMail({
        from: 'dmitriytuz123@gmail.com',
        to: "jb.dmitriy.tkachenko@gmail.com",
        subject: "Your password reset",
        text: "Your password reset !",
        html: `<div>Your new password - ${newPass} </div></br>`
      });

    } catch (e) {
      this.logger.error(`Error during send password reset email: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
