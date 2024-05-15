import { Module } from '@nestjs/common';
import {PasswordService} from "@src/password/password.service";


@Module({
  providers: [PasswordService],
  exports: [PasswordService]
})
export class PasswordModule {}
