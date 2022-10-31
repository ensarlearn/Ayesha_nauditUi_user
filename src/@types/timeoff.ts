import { Employee } from './employee';

export type Timeoff = {
  id: string;
  leaveType: string;
  avatarUrl: string;
  reason?: string;
  status?: string;
  fromDate: string ;
  toDate: string;
  employees: Employee;
  disabled?: boolean;
};

export type TimeoffRequest = {
  id?: string;
  leaveType?: string;
  reason?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  employeesId: string;
};

export type TimeoffState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  timeoffs: Timeoff[];
  timeoff: Timeoff | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedTimeoffName: string;
};
