import { FileDB } from './filedb';
import { Manufacturer } from './manufacturer';
import { User } from './nistuser';
import { Softwares } from './softwares';

export type Systems = {
  id: string;
  name: string;
  macAddress?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  hardDisk?: string;
  purchasedDate?: Date | string | number;
  user: User;
  systemSoftware: Softwares[];
  manufacturer: Manufacturer;
  fileDB: FileDB;
};

export type SystemsRequest = {
  id?: string;
  name?: string;
  macAddress?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  hardDisk?: string;
  purchasedDate?: string;
  userId: string;
  manufacturerId: string;
  softwareIds?: string[];
};

export type SystemsState = {
  loadingStatus: string;
  uploadingStatus: string;
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
