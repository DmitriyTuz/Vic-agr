// import {Controller, Get, UseGuards, Req} from '@nestjs/common';
// import {AccountService} from "@src/account/account.service";
// import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";
// import { Request, Response } from 'express';
//
//
// @Controller()
// export class AccountController {
//   constructor(private accountService: AccountService) {}
//
//   @Get('/api/account')
//   @UseGuards(JwtAuthGuard)
//   // async getOne(@Request() req) {
//   async getOne(@Req() req: Request) {
//     console.log('!!! req.user.id = ', req.user.id);
//     return await this.accountService.getOne(req.user.id);
//   }
// }

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '@src/interfaces/add-field-user-to-Request.interface';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/api/account')
  @UseGuards(JwtAuthGuard)
  async getOne(@Req() req: RequestWithUser) {
    return await this.accountService.getOne(req.user.id);
  }
}
