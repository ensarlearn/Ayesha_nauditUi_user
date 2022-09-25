import { User } from './nistuser';

export type HRTimesheetAttendance = {
  id: string;
  hours: string;
  remarks?: string;
  workDate?: Date | string | number;
  user: User;
  // projects: Project;
  // task: Task;
  // subtask: Subtask
};

export type HRTimesheetAttendanceRequest = {
  id?: string;
  hours?: string;
  remarks?: string;
  workDate?: string;
  userId: string;
};

export type HRTimesheetAttendanceState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  hrTimesheetAttendances: HRTimesheetAttendance[];
  hrTimesheetAttendance: HRTimesheetAttendance | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedHRTimesheetAttendanceName: string;
};
