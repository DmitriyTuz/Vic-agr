import {Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { Request, Response } from 'express';
import { LoginDto } from '@src/auth/dto/login.dto';
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";
import {SignUpDto} from "@src/auth/dto/sign-up.dto";
import {ForgotPasswordDto} from "@src/auth/dto/forgot-password.dto";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto, description: 'Login data' })
  @ApiResponse({ status: 200, description: 'User has been logged in successfully' })
  @ApiResponse({ status: 400, description: 'Unable to login user' })
  @UsePipes(ValidationPipe)
  async login(@Body() reqBody: LoginDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.login(reqBody, req, res);
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User has been successfully logged out' })
  @ApiResponse({ status: 400, description: 'Unable to logout' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto, description: 'Sign up data' })
  @ApiResponse({ status: 201, description: 'User has been successfully registered' })
  @ApiResponse({ status: 400, description: 'Unable to register user' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  signUp(@Body() reqBody: SignUpDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.signUp(reqBody, req, res);
  }

  @Put('/forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ type: ForgotPasswordDto, description: 'Password reset data' })
  @ApiResponse({ status: 200, description: 'Password reset phone has been sent successfully' })
  @ApiResponse({ status: 400, description: 'Unable to process password reset request' })
  @UsePipes(ValidationPipe)
  forgotPassword(@Body() reqBody: ForgotPasswordDto) {
    return this.authService.forgotPassword(reqBody);
  }
}
