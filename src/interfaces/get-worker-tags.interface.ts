import {ReqQueryGetWorkerTagsInterface} from "@src/interfaces/reqQuery.get-worker-tags.interface";

export interface GetWorkerTagsInterface extends ReqQueryGetWorkerTagsInterface {
  companyId?: number;
  id?: number;
}