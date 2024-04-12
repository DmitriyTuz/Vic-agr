import {Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { Request, Response } from 'express';
import { LoginUserDto } from '@src/auth/dto/login-user.dto';
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";
import {SignUpUserDto} from "@src/auth/dto/signUp-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(@Body() reqBody: LoginUserDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.login(reqBody, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @UsePipes(ValidationPipe)
  @Post('/sign-up')
  signUp(@Body() reqBody: SignUpUserDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.signUp(reqBody, req, res);
  }
}
