import { User } from './nistuser';

export type Systems = {
  id: string;
  name: string;
  ipaddress: string;
  os: string;
  user: User;
};

export type SystemsRequest = {
  id: string;
  name: string;
  ipaddress: string;
  os: string;
  userid: string;
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
