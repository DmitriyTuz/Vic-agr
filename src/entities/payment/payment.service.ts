import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as moment from 'moment';

import { PlanTypes } from '@src/lib/constants';

import { RequestWithUser } from '@src/interfaces/users/add-field-user-to-Request.interface';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';

import { Payment } from '@src/entities/payment/payment.entity';
import { Company } from '@src/entities/company/company.entity';
import { Plan } from '@src/entities/plan/plan.entity';
import { StripeService } from '@src/stripe/stripe.service';
import {User} from "@src/entities/user/user.entity";
import {CreatePaymentDto} from "@src/entities/payment/dto/create-payment.dto";
import {ReqBodyCreateSubscribeDto} from "@src/entities/payment/dto/reqBody-create-subscribe.dto";
import {ReqBodyCreatePaymentDto} from "@src/entities/payment/dto/reqBody-create-payment.dto";

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
    // private userService: UserService,
    private stripeService: StripeService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOnePayment(userId: number): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { userId } });
  }

  async create(body: ReqBodyCreatePaymentDto, user: User): Promise <{ success: boolean, notice: string, data: {payment: Payment} }> {
    try {
      body.expiration = `${moment(body.exp_month, 'M').format('MM')}/${moment(body.exp_year, 'YYYY').format('YY')}`;

      if (user.company.isSubscribe) {
        throw new HttpException(`the-subscribe-still-active`, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      let payment: Payment = await this.getOnePayment(user.id);

      if (payment) {
        await this.deletePayment(payment.id);
      }

      payment = await this.createPayment(user, body);

      return {
        success: true,
        notice: 'The payment has been created',
        data: {payment}
      };
    } catch (err) {
      throw err;
    }
  }

  private async deletePayment(paymentId: number) {
    const payment: Payment = await this.paymentRepository.findOne({select: ['id', 'subscriberId', 'userId'], where: {id: paymentId}});

    if (!payment) {
      throw ({status: 404, message: '404-payment-not-found', stack: new Error().stack});
    }

    await this.removeSubscribe(payment);
    await this.paymentRepository.remove(payment);
  }

  private async createPayment(user: User, newPaymentInfo: ReqBodyCreatePaymentDto): Promise<CreatePaymentDto & Payment>{
    // const requiredFields = ['number', 'token', 'cardType','expiration'];
    // this.checkerService.checkRequiredFields(newPaymentInfo, requiredFields, false);

    const {number, cardType, nameOnCard, expiration, token, agree} = newPaymentInfo;
    const customer = await this.stripeService.customerCreate(token, user.phone, user.name);

    const newPayment: CreatePaymentDto = {
      userId: user.id,
      number: number.toString(),
      cardType,
      nameOnCard,
      expiration,
      customerId: customer.id,
      type: 'Stripe',
      agree: !!agree
    };

    return this.paymentRepository.save(newPayment);
  }

  async createSubscribe(paymentId: number, body: ReqBodyCreateSubscribeDto, admin: User): Promise <{ success: boolean, notice: string}> {
    try {
      // const user = await this.userService.getOneUser({ id: req.user.id });

      const { planType, agree } = body;

      const company: Company = await this.companyRepository.findOne({ where: { id: admin.companyId } });

      if (planType === PlanTypes.FREE) {
        if (company.isTrial) {
          throw new HttpException(`You-already-use-the-free-plan.`, HttpStatus.BAD_REQUEST);
        } else if (company.hasTrial) {
          throw new HttpException(`Your-trial-plan-has-expired.`, HttpStatus.PAYMENT_REQUIRED);
        } else {
          await this.companyRepository.update(admin.companyId, { isTrial: true, trialAt: new Date(), hasTrial: true });
        }
      } else {
        // paymentId = parseInt(paymentId, 10);

        console.log('!!! paymentId = ', paymentId);

        if (!paymentId) {
          throw new HttpException(`Payment-ID-not-found.`, HttpStatus.NOT_FOUND);
        }

        const payment: Payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

        if (!payment) {
          throw new HttpException(`Payment-not-found.`, HttpStatus.NOT_FOUND);
        }

        if (!payment.agree && !agree) {
          throw new HttpException(`Please-confirm-the-agreement.`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const plan: Plan = await this.planRepository.findOne({ where: { name: planType } });

        if (!plan) {
          throw new HttpException(`Plan-not-found.`, HttpStatus.NOT_FOUND);
        }

        const subscriber = await this.stripeService.createSubscribers(
          {
            customer: payment.customerId,
            price: plan.stripeId,
          },
          admin,
        );

        await this.companyRepository.update(admin.companyId, { isSubscribe: true, isTrial: false, trialAt: null });
        await this.paymentRepository.update(paymentId, {
          subscriberId: subscriber.id,
          paidAt: new Date(),
          agree: payment.agree || agree,
        });
      }

      return  {
        success: true,
        notice: 'Subscribed',
      };

    } catch (e) {
      this.logger.error(`Error during subscribe creation: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async removeSubscribe(payment: Payment): Promise<{ success: boolean, notice: string }> {
    const user: User = await this.userRepository.findOne({select: ['id', 'companyId'], where: {id: payment.userId}});
    const company: Company = await this.companyRepository.findOne({select: ['id', 'isTrial'], where: {id: user.companyId}});

    if (company.isTrial) {
      await this.companyRepository.update({ id: user.companyId }, { isTrial: false });
    } else if (payment?.subscriberId) {
      await Promise.all([
        this.stripeService.cancelSubscribe(payment.subscriberId),
        this.companyRepository.update({ id: user.companyId }, { isSubscribe: false }),
        this.paymentRepository.update({ id: payment.id }, { subscriberId: null })
      ]);

      console.log('The Subscribe has been cancelled successfully')
    }

    return  {
      success: true,
      notice: 'Unsubscribed'
    }
  }

}
