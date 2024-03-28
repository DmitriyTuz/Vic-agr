export interface GetTasksOptionsInterface {
  // dueDate?: Date;
  status?: string;
  date?: Date;
  type?: string;
  location?: { lat: number, lng: number };
  tags?: { id: number, name: string }[];
  companyId?: number;
  userId?: number;
}
