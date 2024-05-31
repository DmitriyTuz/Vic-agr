import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import generator from 'generate-password';
import { JwtService } from '@nestjs/jwt';

import { User } from '@src/entities/user/user.entity';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@src/entities/user/user.service';
import { LoginDto } from '@src/auth/dto/login.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserTypes} from "@src/lib/constants";
import {SignUpDto} from "@src/auth/dto/sign-up.dto";
import {CompanyService} from "@src/entities/company/company.service";
import {Company} from "@src/entities/company/company.entity";
import {CreateCompanyDto} from "@src/entities/company/dto/create-company.dto";
import {CreateUserDto} from "@src/entities/user/dto/create-user.dto";
import {PasswordService} from "@src/password/password.service";
import {TwilioService} from "@src/twilio/twilio.service";
import {CheckerService} from "@src/checker/checker.service";

import * as nodemailer from 'nodemailer';
import {MailService} from "@src/mail/mail.service";
import {UpdateUserDto} from "@src/entities/user/dto/update-user.dto";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";
import {RequestWithUser} from "@src/interfaces/users/add-field-user-to-Request.interface";


interface TokenPayload {
  id: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
      private userService: UserService,
      private jwtService: JwtService,
      private configService: ConfigService,
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private companyService: CompanyService,
      @InjectRepository(Company)
      private companyRepository: Repository<Company>,
      private readonly passwordService: PasswordService,
      private readonly twilioService: TwilioService,
      private readonly checkerService: CheckerService,
      private readonly mailService: MailService,
  ) {}

  async login(reqBody: LoginDto): Promise<{ success: boolean, token: string }> {
    try {
      const user: User = await this.validateUser(reqBody);
      const token: string = await this.generateToken(user);

      user.lastActive = new Date();
      await this.userRepository.save(user)

      return { success: true, token: token };

    } catch (e) {
      this.logger.error(`Error during user login: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async validateUser(dto: LoginDto): Promise<User> {
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
  }

  async logout(req: Request, res: Response): Promise<Response<Record<string, any>>> {
    try {
      delete req.headers.authorization;
      res.clearCookie('AuthorizationToken');

      return res.status(200).send({success: true});
    } catch (e) {
      this.logger.error(`Error during user logout: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async signUp(reqBody: SignUpDto): Promise<{ success: boolean, token: string }> {
    try {
      // req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const { logo, companyName, phone, name, password } = reqBody;

      const newCompany: CreateCompanyDto = {
        name: companyName,
        logo
      }

      const company = await this.companyService.createCompany(newCompany);

      const newUser: CreateUserDto = {
        phone,
        name,
        type: UserTypes.ADMIN,
        password,
        companyId: company.id
      }

      const { user } = await this.userService.createUser(newUser);

      company.ownerId = user.id;
      await this.companyRepository.save(company)

      const token: string = await this.generateToken(user);

      // res.cookie('AuthorizationToken', token, {
      //   maxAge: this.configService.get('JWT_EXPIRED_TIME'),
      //   httpOnly: true,
      // });

      return { success: true, token: token };
      // return res.json({success: true})
    } catch (e) {
      this.logger.error(`Error during user signIn: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async forgotPassword(body): Promise<{ notice: string, smsMessage?: string }> {
    try {
      const {phone} = body;

      const user: User = await this.userService.getOneUser({phone});

      if (!user) {
        throw new HttpException('looks-like-you-do-not-have-an-account-yet', HttpStatus.NOT_FOUND);
      }

      const newPass: string = this.passwordService.createPassword();
      const hashNewPas: string = await this.passwordService.hashPassword(newPass);
      const updateData: {password: string} = {password: hashNewPas};

      await this.userService.updateUser(user, updateData)
      const message: string = await this.twilioService.sendSMS(phone, newPass);

      await this.mailService.sendPasswordResetEmail(newPass)

      let response: { notice: string, smsMessage?: string } = {
        notice: '200-the-password-has-been-reset',
      }

      response = this.checkerService.checkResponse(response, message);

      return response;
    } catch (e) {
      this.logger.error(`Error during user forgotPassword: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async googleLogin(req: RequestWithUser): Promise<User> {
    try {
      if (!req.user) {
        throw new HttpException('No user from Google', HttpStatus.NOT_FOUND);
      }

      return req.user
      // return user
    } catch (err) {
      console.log('! error = ', err);
      throw err
    }
  }
}
