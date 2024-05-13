import { Injectable } from '@nestjs/common';
import Credentials from "@src/lib/credentials";

@Injectable()
export class CheckerService {

  checkResponse(response, message) {
    if (Credentials.config.NODE_ENV !== 'production') {
      response.smsMessage = message;
    }

    return response
  }
}
