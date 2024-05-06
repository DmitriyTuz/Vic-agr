import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { LocationService } from '@src/entities/location/location.service';
import { RequestWithUser } from '@src/interfaces/users/add-field-user-to-Request.interface';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('/get-locations')
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: RequestWithUser) {
    return this.locationService.getAll(req.user.id);
  }
}
