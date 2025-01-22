import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { Request, Response } from 'express';
import { LoginDto } from '@src/auth/dto/login.dto';
import {ValidationPipe} from "@src/pipes/validation.pipe";
import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";
import {SignUpDto} from "@src/auth/dto/sign-up.dto";
import {ForgotPasswordDto} from "@src/auth/dto/forgot-password.dto";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {RequestWithUser} from "@src/interfaces/users/add-field-user-to-Request.interface";
import {AuthGuard} from "@nestjs/passport";
import {LoggingInterceptor} from "@src/interceptors/logging.interceptor";

const configService = new ConfigService();

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private configService: ConfigService
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto, description: 'Login data' })
  @ApiResponse({ status: 200, description: 'User has been logged in successfully' })
  @ApiResponse({ status: 400, description: 'Unable to login user' })
  @UsePipes(ValidationPipe)
  async login(@Body() reqBody: LoginDto, @Req() req: Request, @Res() res: Response) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const result = await this.authService.login(reqBody);

    res.cookie('AuthorizationToken', result.token, {
      maxAge: this.configService.get('JWT_EXPIRED_TIME'),
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json(result);
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'User has been successfully logged out' })
  @ApiResponse({ status: 400, description: 'Unable to logout' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    delete req.headers.authorization;
    res.clearCookie('AuthorizationToken');

    res.status(HttpStatus.OK).json({success: true})
  }

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto, description: 'Sign up data' })
  @ApiResponse({ status: 201, description: 'User has been successfully registered' })
  @ApiResponse({ status: 400, description: 'Unable to register user' })
  @ApiBearerAuth('JWT')
  @UsePipes(ValidationPipe)
  @UseInterceptors(LoggingInterceptor)
  async signUp(@Body() reqBody: SignUpDto, @Req() req: Request, @Res() res: Response) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const result = await this.authService.signUp(reqBody);

    res.cookie('AuthorizationToken', result.token, {
      maxAge: this.configService.get('JWT_EXPIRED_TIME'),
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json(result);
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

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: RequestWithUser) {
    return {msg: 'Google Authentication'}
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser) {
    return this.authService.googleLogin(req);
  }
}
