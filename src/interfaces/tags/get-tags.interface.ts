import {ReqQueryGetTagsInterface} from "@src/interfaces/tags/reqQuery.get-tags.interface";

export interface GetTagsInterface extends ReqQueryGetTagsInterface {
  action?: string;
  companyId?: number;
  ids?: number[];
}
