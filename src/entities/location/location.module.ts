import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationService} from "@src/entities/location/location.service";
import {LocationController} from "@src/entities/location/location.controller";
import {MapLocation} from "@src/entities/location/location.entity";
import {UserModule} from "@src/entities/user/user.module";


@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [TypeOrmModule.forFeature([MapLocation]), UserModule],
})
export class LocationModule {}
