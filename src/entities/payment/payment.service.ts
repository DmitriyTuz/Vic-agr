import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlanTypes } from '@lib/constants';

import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';

import { Payment } from '@src/entities/payment/payment.entity';
import { Company } from '@src/entities/company/company.entity';
import { Plan } from '@src/entities/plan/plan.entity';

import { UserService } from '@src/entities/user/user.service';
import { StripeService } from '@src/stripe/stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    private userService: UserService,
    private stripeService: StripeService,
  ) {}

  async getOnePayment(userId: number): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { userId } });
  }

  async createSubscribe(req: RequestWithUser, paymentId, body: { planType: string; agree: boolean }) {
    try {
      const user = await this.userService.getOneUser({ id: req.user.id });

      const { planType, agree } = body;

      const company = await this.companyRepository.findOne({ where: { id: user.companyId } });

      if (planType === PlanTypes.FREE) {
        if (company.isTrial) {
          throw new HttpException(`You-already-use-the-free-plan.`, HttpStatus.BAD_REQUEST);
        } else if (company.hasTrial) {
          throw new HttpException(`Your-trial-plan-has-expired.`, HttpStatus.PAYMENT_REQUIRED);
        } else {
          await this.companyRepository.update(user.companyId, { isTrial: true, trialAt: new Date(), hasTrial: true });
        }
      } else {
        paymentId = parseInt(paymentId, 10);

        if (!paymentId) {
          throw new HttpException(`Payment-ID-not-found.`, HttpStatus.NOT_FOUND);
        }

        const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

        if (!payment) {
          throw new HttpException(`Payment-not-found.`, HttpStatus.NOT_FOUND);
        }

        if (!payment.agree && !agree) {
          throw new HttpException(`Please-confirm-the-agreement.`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const plan = await this.planRepository.findOne({ where: { name: planType } });

        if (!plan) {
          throw new HttpException(`Plan-not-found.`, HttpStatus.NOT_FOUND);
        }

        const subscriber = await this.stripeService.createSubscribers(
          {
            customer: payment.customerId,
            price: plan.stripeId,
          },
          user,
        );

        await this.companyRepository.update(user.companyId, { isSubscribe: true, isTrial: false, trialAt: null });
        await this.paymentRepository.update(paymentId, {
          subscriberId: subscriber.id,
          paidAt: new Date(),
          agree: payment.agree || agree,
        });
      }

      const responseData = {
        success: true,
        notice: 'Subscribed',
      };

      return responseData;
    } catch (e) {
      this.logger.error(`Error during subscribe creation: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
