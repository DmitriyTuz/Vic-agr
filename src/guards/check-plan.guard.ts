import {Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {User} from "@src/entities/user/user.entity";
import {Company} from "@src/entities/company/company.entity";
import {StripeService} from "@src/stripe/stripe.service";
import {UserTypes} from "@lib/constants";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CustomHttpException} from "@src/exceptions/сustomHttp.exception";


@Injectable()
export class CheckPlanGuard implements CanActivate {
  constructor(
      private reflector: Reflector,
      private stripeService: StripeService,
      @InjectRepository(Company)
      private companyRepository: Repository<Company>
      ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    try {
      const company: Company = await this.companyRepository.findOne({
        select: ['id', 'isTrial', 'trialAt', 'isSubscribe'],
        where: { id: user.companyId },
      });

      if (user.type !== UserTypes.SUPER_ADMIN) {
        if (company.isTrial) {
          const isExpired = this.stripeService.checkTrialDays(new Date(), company.trialAt);
          if (isExpired) {
            await this.companyRepository.update(company.id, { isTrial: false, trialAt: null });
          }
        } else if (!company.isSubscribe) {
          throw new HttpException('422-your-subscription-has-been-expired', HttpStatus.UNPROCESSABLE_ENTITY);
        }
      }

      return true;
    } catch (e) {
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
