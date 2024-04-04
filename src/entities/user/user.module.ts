import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@src/entities/user/user.controller';
import { UserService } from '@src/entities/user/user.service';
import { User } from '@src/entities/user/user.entity';
import { AuthModule } from '@src/auth/auth.module';
import { HelperModule } from '@src/helper/helper.module';
import {PasswordModule} from "@src/password/password.module";
import {TwilioModule} from "@src/twilio/twilio.module";
import {Tag} from "@src/entities/tag/tag.entity";
import {TagModule} from "@src/entities/tag/tag.module";


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Tag]),
    forwardRef(() => AuthModule),
    HelperModule,
    PasswordModule,
    TwilioModule,
    forwardRef(() => TagModule)
  ],
  exports: [UserService],
})
export class UserModule {}
