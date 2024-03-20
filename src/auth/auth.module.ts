import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@src/entities/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';

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
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
