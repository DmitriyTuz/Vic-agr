import {Body, Controller, Post, Req, Res, UsePipes} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { Request, Response } from 'express';
import { LoginUserDto } from '@src/auth/dto/login-user.dto';
import {ValidationPipe} from "@src/pipes/validation.pipe";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/api/login')
  async login(@Body() reqBody: LoginUserDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.login(reqBody, req, res);
  }
}
