import { FileDB } from './filedb';
// import { Manufacturer } from './manufacturer';
// import { User } from './nistuser';
// import { Softwares } from './softwares';

export type Holidays = {
  id: string;
  title: string;
  dates: string;
  fileDB: FileDB;
};

export type HolidaysRequest = {
  id?: string;
  title?: string;
  dates?: string;
};

export type HolidaysState = {
  loadingStatus: string;
  uploadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  holidays: Holidays[];
  holiday: Holidays | null;
  sortBy: string | null;
  filters: {
    title: string;
  };
  selectedHolidaysName: string;
};
