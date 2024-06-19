import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {UserService} from "@src/entities/user/user.service";

@Injectable()
export class UserProducerService {

  constructor(@InjectQueue('user-queue') private queue: Queue,
              private userService: UserService
  ) {}

  async findUserDB(id: number) {
    let user = await this.userService.findById(id);
    await this.queue.add('user-job', {name: user.name}, {delay: 5000})
  }
}