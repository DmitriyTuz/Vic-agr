import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { PaymentService } from '@src/entities/payment/payment.service';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';

@Controller()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/api/payment/:id/create-subscribe')
  async createSubscribe(
    @Req() req: RequestWithUser,
    @Param('id') paymentId,
    @Body() body: { planType: string; agree: boolean },
  ) {
    return this.paymentService.createSubscribe(req, paymentId, body);
  }
}
