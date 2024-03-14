import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {AccountService} from "@src/account/account.service";
import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/api/account')
  @UseGuards(JwtAuthGuard)
  async getOne(@Request() req) {
    return await this.accountService.getOne(req.user.id);
  }
}
