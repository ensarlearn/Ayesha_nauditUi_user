import { User } from './nistuser';

export type HRStatus = {
  id: string;
  title: string;
  description?: string;
  workDate?: Date | string | number;
  user: User;
};

export type HRStatusRequest = {
  id?: string;
  title?: string;
  description?: string;
  workDate?: string;
  userId: string;
};

export type HRStatusState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  hrStatuses: HRStatus[];
  hrStatus: HRStatus | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedHRStatusName: string;
};
