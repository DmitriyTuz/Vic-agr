import { Injectable } from '@nestjs/common';

@Injectable()
export class TwilioService {
  sendSMS(phone: string, password: string) {
    try {
      const message: string = `Your password is -> ${password} <- `;

      // if (NODE_ENV === 'production') {
      //     await client.messages.create({
      //         body: message,
      //         from: TWILIO_NUMBER,
      //         to: phone
      //     });
      // }
      // else {
      // console.log(`DEVELOPER MODE:`, message)
      // }

      return message;
    } catch (e) {
      throw (e)
    }
  }
}
