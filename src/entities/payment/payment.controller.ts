import {Body, Controller, HttpException, HttpStatus, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { PaymentService } from '@src/entities/payment/payment.service';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import {UserService} from "@src/entities/user/user.service";
import {ReqBodyForCreatePaymentDto} from "@src/entities/payment/dto/reqBody-for-create-payment.dto";
import {CreatePaymentDto} from "@src/entities/payment/dto/create-payment.dto";
import {ApiExtraModels, ApiTags} from "@nestjs/swagger";
import {ReqBodyForCreateSubscribeDto} from "@src/entities/payment/dto/reqBody-for-create-subscribe.dto";
import {Payment} from "@src/entities/payment/payment.entity";
import {User} from "@src/entities/user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@ApiTags('Payments')
@Controller('payment')
@ApiExtraModels(CreatePaymentDto)
export class PaymentController {
  constructor(
      private paymentService: PaymentService,
      private userService: UserService,
      @InjectRepository(Payment)
      private paymentRepository: Repository<Payment>,
      ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-payment')
  async create(
      @Req() req: RequestWithUser,
      @Body() body: ReqBodyForCreatePaymentDto
  ) {
    const user = await this.userService.getOneUser({id: req.user.id});
    return this.paymentService.create(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/create-subscribe')
  async createSubscribe(
    @Req() req: RequestWithUser,
    @Param('id') paymentId: number,
    // @Body() body: { planType: string; agree: boolean },
    @Body() body: ReqBodyForCreateSubscribeDto,
  ) {
    const user: User = await this.userService.getOneUser({ id: req.user.id });
    return this.paymentService.createSubscribe(paymentId, body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/remove-subscribe')
  async removeSubscribe(
      @Req() req: RequestWithUser,
      @Param('id') paymentId: number,
  ) {
    if (!paymentId) {
      throw new HttpException(`payment-id-not-found`, HttpStatus.NOT_FOUND);
    }

    const payment: Payment = await this.paymentRepository.findOne({select: ['id', 'userId', 'subscriberId', 'customerId'], where: {id: paymentId}});

    if (payment) {
      return await this.paymentService.removeSubscribe(payment);
    }
  }

}
