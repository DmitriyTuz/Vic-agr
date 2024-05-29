import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { PaymentService } from '@src/entities/payment/payment.service';
import { RequestWithUser } from '@src/interfaces/users/add-field-user-to-Request.interface';
import {UserService} from "@src/entities/user/user.service";
import {ReqBodyCreatePaymentDto} from "@src/entities/payment/dto/reqBody-create-payment.dto";
import {CreatePaymentDto} from "@src/entities/payment/dto/create-payment.dto";
import {ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReqBodyCreateSubscribeDto} from "@src/entities/payment/dto/reqBody-create-subscribe.dto";
import {Payment} from "@src/entities/payment/payment.entity";
import {User} from "@src/entities/user/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ReqBodyCreateUserDto} from "@src/entities/user/dto/reqBody.create-user.dto";
import {ValidationPipe} from "@src/pipes/validation.pipe";

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

  @Post('/create-payment')
  @ApiOperation({ summary: 'Create new payment' })
  @ApiBody({ type: ReqBodyCreatePaymentDto, description: 'Payment data' })
  @ApiResponse({ status: 200, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: RequestWithUser, @Body() body: ReqBodyCreatePaymentDto) {
    const user = await this.userService.getOneUser({id: req.user.id});
    return this.paymentService.create(body, user);
  }

  @Post('/:id/create-subscribe')
  @ApiOperation({ summary: 'Create subscription' })
  @ApiResponse({ status: 200, description: 'Subscription created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid subscription data' })
  @ApiBearerAuth('JWT')
  @ApiParam({ name: 'id', example: '10001', description: 'Payment ID', type: 'number' })
  @ApiBody({ type: ReqBodyCreateSubscribeDto, description: 'Subscription data' })
  @UseGuards(JwtAuthGuard)
  async createSubscribe(
    @Req() req: RequestWithUser,
    @Param('id') paymentId: number,
    @Body() body: ReqBodyCreateSubscribeDto,
  ) {
    const user: User = await this.userService.getOneUser({ id: req.user.id });
    return this.paymentService.createSubscribe(paymentId, body, user);
  }

  @Delete('/:id/remove-subscribe')
  @ApiOperation({ summary: 'Remove subscription' })
  @ApiResponse({ status: 200, description: 'Subscription removed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment id' })
  @ApiParam({ name: 'id', example: '10001', description: 'Payment ID', type: 'number' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async removeSubscribe(
      @Req() req: RequestWithUser,
      @Param('id') paymentId: number,
  ) {

    return this.paymentService.removeSubscribe(paymentId);

    // if (!paymentId) {
    //   throw new HttpException(`payment-id-not-found`, HttpStatus.NOT_FOUND);
    // }
    //
    // const payment: Payment = await this.paymentService.findById(paymentId);
    // // const payment: Payment = await this.paymentRepository.findOne({select: ['id', 'userId', 'subscriberId', 'customerId'], where: {id: paymentId}});
    //
    // if (payment) {
    //   return await this.paymentService.removeSubscribe(payment);
    // }
  }

}
