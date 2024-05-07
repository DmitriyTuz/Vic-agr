export interface CreateTaskInterface {
  title: string;
  type: string;
  executionTime: number | null;
  comment: string | null;
  mediaInfo: Record<string, any>[] | null;
  documentsInfo: Record<string, any>[] | null;
  dueDate: Date | null;
  companyId: number;
  userId: number;
}