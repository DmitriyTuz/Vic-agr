import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from '@src/entities/user/user.entity';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@src/entities/user/user.service';
import { LoginUserDto } from '@src/auth/dto/login-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

interface TokenPayload {
  id: number;
}

interface TokenResponse {
  token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
      private userService: UserService,
      private jwtService: JwtService,
      private configService: ConfigService,
      @InjectRepository(User)
      private userRepository: Repository<User>
  ) {}

  async login(reqBody: LoginUserDto, req: Request, res: Response): Promise<Response> {
    try {
      req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const user: User = await this.validateUser(reqBody);
      const token: string = await this.generateToken(user);
      res.cookie('AuthorizationToken', token, {
        maxAge: this.configService.get('JWT_EXPIRED_TIME'),
        httpOnly: true,
      });

      user.lastActive = new Date();
      await this.userRepository.save(user)

      return res.json({success: true});

    } catch (e) {
      this.logger.error(`Error during user login: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async validateUser(dto: LoginUserDto): Promise<User> {
    const user: User | undefined = await this.userService.findByPhone(dto.phone);

    if (user) {
      const passwordEquals: boolean = await bcrypt.compare(dto.password, user.password);

      if (passwordEquals) {
        return user;
      }
    }

    throw new HttpException('Incorrect-phone-or-password', HttpStatus.UNAUTHORIZED);
  }

  private async generateToken(user: User): Promise<string> {
    // const payload = { name: user.name, phone: user.phone, id: user.id };
    const payload: TokenPayload = { id: user.id };
    const secretKey: string = this.configService.get('PRIVATE_KEY') || 'SECRET';
    const expiresIn: string = '24h';

    const token: string = this.jwtService.sign(payload, { secret: secretKey, expiresIn });
    return token;
    // return { token };
  }

  async logout(req: Request, res: Response) {
    try {
      delete req.headers.authorization;
      res.clearCookie('AuthorizationToken');

      return res.status(200).send({success: true});
    } catch (e) {
      this.logger.error(`Error during user logout: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }
}
