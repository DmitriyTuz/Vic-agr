import { Injectable } from '@nestjs/common';
import {UserService} from "@src/entities/user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MapLocation} from "@src/entities/location/location.entity";

@Injectable()
export class LocationService {

  constructor(
      @InjectRepository(MapLocation)
      private locationRepository: Repository<MapLocation>,
      private userService: UserService) {}

  async getAll(currentUserId) {
    try {

      const user = await this.userService.getOneUser({id: currentUserId});

      // const locations = await this.getAllLocations({companyId: user.companyId});
      const locations = await this.getAllLocations(user.companyId);
      const returningLocations = locations.map((location) => ({
        lat: +location.lat,
        lng: +location.lng,
      }));
      const response = {
        success: true,
        data: {locations: returningLocations}
      };

      return response
    } catch (err) {
      throw err;
    }
  }

  // async getAllLocations(options: { companyId: number }): Promise<MapLocation[]> {
  //   const { companyId } = options;
  //   const query: any = {
  //     select: ['id', 'lat', 'lng'],
  //     where: {}
  //   };
  //
  //   if (companyId) {
  //     query.where.companyId = companyId;
  //   }
  //
  //   const locations = await this.locationRepository.find(query);
  //   return locations;
  // }

  async getAllLocations(companyId: number): Promise<MapLocation[]> {

    const query: any = {
      select: ['id', 'lat', 'lng'],
      where: {}
    };

    if (companyId) {
      query.where.companyId = companyId;
    }

    const locations = await this.locationRepository.find(query);
    return locations;
  }
}
