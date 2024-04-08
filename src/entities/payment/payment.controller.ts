import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { PaymentService } from '@src/entities/payment/payment.service';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';
import {UserService} from "@src/entities/user/user.service";
import {ReqBodyPaymentDto} from "@src/entities/payment/dto/reqBody.payment.dto";
import {CreatePaymentDto} from "@src/entities/payment/dto/create-payment.dto";
import {ApiExtraModels, ApiTags} from "@nestjs/swagger";

@ApiTags('Payments')
@Controller('/api/payment')
@ApiExtraModels(CreatePaymentDto)
export class PaymentController {
  constructor(
      private paymentService: PaymentService,
      private userService: UserService
      ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-payment')
  async create(
      @Req() req: RequestWithUser,
      @Body() body: ReqBodyPaymentDto
  ) {
    const user = await this.userService.getOneUser({id: req.user.id});
    return this.paymentService.create(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/create-subscribe')
  async createSubscribe(
    @Req() req: RequestWithUser,
    @Param('id') paymentId: number,
    @Body() body: { planType: string; agree: boolean },
  ) {
    const user = await this.userService.getOneUser({ id: req.user.id });
    return this.paymentService.createSubscribe(paymentId, body, user);
  }

}
