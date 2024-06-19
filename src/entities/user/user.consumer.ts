import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";

@Processor('user-queue')
export class UserConsumer {

  @Process('user-job')
  userjob(job: Job<unknown>) {
    console.log(job.data);
  }
}