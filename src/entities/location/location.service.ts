import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@src/entities/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import {FindManyOptions, Repository} from 'typeorm';
import { MapLocation } from '@src/entities/location/location.entity';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import {User} from "@src/entities/user/user.entity";
import {Tag} from "@src/entities/tag/tag.entity";
import {GetLocationsOptionsInterface} from "@src/interfaces/get-locations-options.interface";

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(MapLocation)
    private locationRepository: Repository<MapLocation>,
    private userService: UserService,
  ) {}

  async getAll(currentUserId: number): Promise<{ success: boolean; data: { locations: {lat: number, lng: number}[]; } }> {
    try {
      const user: User = await this.userService.getOneUser({ id: currentUserId });

      const locations: MapLocation[] = await this.getAllLocations({companyId: user.companyId});
      const returnedLocations: {lat: number, lng: number}[] = locations.map((location) => ({
        lat: +location.lat,
        lng: +location.lng,
      }));
      return  {
        success: true,
        data: { locations: returnedLocations },
      };

    } catch (e) {
      this.logger.error(`Error during get all locations: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllLocations(options: GetLocationsOptionsInterface): Promise<MapLocation[]> {
    const query: FindManyOptions<MapLocation> = {
      select: ['id', 'lat', 'lng'],
      where: {},
    };

    if (options.companyId) {
      query.where = { ...(query.where || {}), companyId: options.companyId };
    }

    return  await this.locationRepository.find(query);
  }
}
