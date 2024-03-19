import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

import {User} from "@src/entities/user/user.entity";
import {CustomHttpException} from "@src/exceptions/сustomHttp.exception";
import {ConfigService} from "@nestjs/config";
import {UserService} from "@src/entities/user/user.service";
import {LoginUserDto} from "@src/auth/dto/login-user.dto";

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
      private userService: UserService,
      private jwtService: JwtService,
      private configService: ConfigService
  ) {}

  async login(reqBody: LoginUserDto, req: Request, res: Response) {
    try {

      req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const user: User = await this.validateUser(reqBody);
      const token = await this.generateToken(user)
      res.cookie('AuthorizationToken', token.token, { maxAge: this.configService.get('JWT_EXPIRED_TIME'), httpOnly: true });

      user.lastActive = new Date();
      await this.userService.updateUser(user);

      const responseData = {
        success: true,
      };

      return res.json(responseData);
    } catch (e) {
      this.logger.error(`Error during user login: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async validateUser(dto: LoginUserDto) {
    const user = await this.userService.findByPhone(dto.phone);
    const passwordEquals = await bcrypt.compare(
        dto.password,
        user.password
    );
    if (user && passwordEquals) {

      return user;
    }
    throw new HttpException(
        "Incorrect-phone-or-password",
        HttpStatus.UNAUTHORIZED
    );
  }

  private async generateToken(user: User) {
    // const payload = { name: user.name, phone: user.phone, id: user.id };
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: this.configService.get('PRIVATE_KEY') || "SECRET",
        expiresIn: "24h"
      }),
    };
  }
}
