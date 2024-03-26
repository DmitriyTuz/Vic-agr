import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "@src/auth/jwt-auth.guard";
import {LocationService} from "@src/entities/location/location.service";
import {RequestWithUser} from "@src/interfaces/add-field-user-to-Request.interface";

@Controller(

)
export class LocationController {

  constructor(private locationService: LocationService,
              ) {}

  // @Get('/api/locations')
  // @UseGuards(JwtAuthGuard)
  // async getAll(@Req() req: RequestWithUser) {
  //   const user = await this.userService.getOneUser({id: req.user.id});
  //   return this.locationService.getAll(user);
  // }
}
