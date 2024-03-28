import {Task} from "@src/entities/task/task.entity";
import {Company} from "@src/entities/company/company.entity";

export interface UserDataInterface {
  id: number;
  name: string;
  phone: string;
  type: string;
  tasks: Task[];
  hasOnboard: boolean;
  companyId: number;
  company: Company;
  tags: string[];
}

