export interface TaskDataInterface {
  id: number;
  title: string;
  mapLocation: { lat: number; lng: number }[] | null;
  type: string;
  executionTime: number | null;
  comment: string | null;
  mediaInfo: any | null;
  documentsInfo: any | null;
  status: string;
  workers: any[] | null;
  tags: any[] | null;
  completeInfo: any[] | null;
  reportInfo: any[] | null;
  creator: any | null;
  createdAt: number | null;
  updatedAt: number | null;
  completedAt: number | null;
  dueDate: number | null;
}