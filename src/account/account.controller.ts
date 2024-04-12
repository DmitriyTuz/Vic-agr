import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { AccountService } from '@src/account/account.service';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('account')
  @UseGuards(JwtAuthGuard)
  async getOne(@Req() req: RequestWithUser) {
    return await this.accountService.getOne(req.user.id);
  }
}
