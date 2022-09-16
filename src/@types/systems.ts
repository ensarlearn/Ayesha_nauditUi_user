import { User } from './nistuser';
import { Softwares } from './softwares';

export type Systems = {
  id: string;
  name: string;
  ipAddress?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  hardDisk?: string;
  user: User;
  systemSoftware: Softwares[];
};

export type SystemsRequest = {
  id: string;
  name: string;
  ipAddress?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  hardDisk?: string;
  userId: string;
};

export type SystemsState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  systems: Systems[];
  system: Systems | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedSystemsName: string;
};
