import { Module } from '@nestjs/common';
import {CheckerService} from "@src/checker/checker.service";
import {CheckerController} from "@src/checker/checker.controller";


@Module({
  controllers: [CheckerController],
  providers: [CheckerService],
  exports: [CheckerService],
})
export class CheckerModule {}
