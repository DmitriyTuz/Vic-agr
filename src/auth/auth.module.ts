import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@src/entities/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@src/entities/user/user.entity";
import {CompanyModule} from "@src/entities/company/company.module";
import {Company} from "@src/entities/company/company.entity";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    // UserModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      // secret: process.env.PRIVATE_KEY || "SECRET",
      // signOptions: {
      //   expiresIn: "24h",
      // },
    }),
    PassportModule,
    TypeOrmModule.forFeature([User, Company]),
    CompanyModule
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
