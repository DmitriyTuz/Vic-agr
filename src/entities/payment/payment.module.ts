import {forwardRef, Module} from '@nestjs/common';
import { PaymentController } from '@src/entities/payment/payment.controller';
import { PaymentService } from '@src/entities/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@src/entities/payment/payment.entity';
import { Company } from '@src/entities/company/company.entity';
import { Plan } from '@src/entities/plan/plan.entity';
import { StripeModule } from '@src/stripe/stripe.module';
import { UserModule } from '@src/entities/user/user.module';
import {User} from "@src/entities/user/user.entity";
import {UserService} from "@src/entities/user/user.service";
import {Task} from "@src/entities/task/task.entity";
import {Tag} from "@src/entities/tag/tag.entity";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([Payment, Company, Plan, User]),
    forwardRef(() => UserModule),
    StripeModule
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
