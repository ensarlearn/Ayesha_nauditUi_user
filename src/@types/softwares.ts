import { Manufacturer } from './manufacturer';

export type Softwares = {
  id: string;
  name: string;
  version: string;
  owner: string;
  vendor: string;
  installDate: string;
  support: string;
  license: string;
};

export type SoftwaresRequest = {
  id: string;
  name: string;
  version: string;
  owner: string;
  vendor: string;
  installDate: string;
  support: string;
  license: string;
};

export type SoftwaresState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  softwares: Softwares[];
  software: Softwares | null;
  manufacturers: Manufacturer[];
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedSoftwaresName: string;
};
