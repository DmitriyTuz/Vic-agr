import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@src/entities/user/user.service';
import { PaymentService } from '@src/entities/payment/payment.service';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { User } from '@src/entities/user/user.entity';
import { Payment } from '@src/entities/payment/payment.entity';

@Injectable()
export class AccountService {
  private readonly logger: Logger = new Logger(AccountService.name);

  constructor(private usersService: UserService, private paymentService: PaymentService) {}

  async getOne(currentUserId: number) {
    try {
      const user: User = await this.usersService.getOneUser({ id: currentUserId });

      if (!user) {
        throw new HttpException(`user-not-found`, HttpStatus.NOT_FOUND);
      }

      const payment: Payment = await this.paymentService.getOnePayment(user.id);

      return {
        success: true,
        data: {
          user: this.usersService.getUserData(user),
          payment,
          company: user.company,
        },
      };
    } catch (e) {
      this.logger.error(`Error during get account: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
