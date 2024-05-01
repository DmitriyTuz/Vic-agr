import {ReqQueryGetUsersInterface} from "@src/interfaces/reqQuery.get-users.interface";

export interface GetUsersInterface extends ReqQueryGetUsersInterface{
  ids?: string[] | string | undefined;
  limit?: number;
  companyId?: number;
  id?: number;
  phone?: string;
}