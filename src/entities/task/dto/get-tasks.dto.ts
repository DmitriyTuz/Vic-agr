import {ReqBodyGetTasksDto} from "@src/entities/task/dto/reqBody.get-tasks.dto";

export class GetTasksDto extends ReqBodyGetTasksDto {

  readonly location?: { lat: number, lng: number };

  readonly companyId?: number;

  readonly userId?: number;
}