import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from '@src/entities/tag/tag.controller';
import { TagService } from '@src/entities/tag/tag.service';
import { Tag } from '@src/entities/tag/tag.entity';
import { UserModule } from '@src/entities/user/user.module';
import {User} from "@src/entities/user/user.entity";
import {HelperModule} from "@src/helper/helper.module";
import {PasswordModule} from "@src/password/password.module";
import {TwilioModule} from "@src/twilio/twilio.module";
import {Task} from "@src/entities/task/task.entity";

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [
    TypeOrmModule.forFeature([Tag, User, Task]),
    forwardRef(() => UserModule),
    HelperModule,
    PasswordModule,
    TwilioModule
  ],
  exports: [TagService],
})
export class TagModule {}
