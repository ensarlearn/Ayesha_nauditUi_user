import { User } from './nistuser';
import { HRProject } from './hrproject';
import { HRTask } from './hrtask';
import { HRSubtask } from './hrsubtask';

export type HRTimesheetAttendance = {
  id: string;
  hours: string;
  remarks?: string;
  workDate?: Date | string | number;
  user: User;
  project: HRProject;
  task: HRTask;
  subtask: HRSubtask
};

export type HRTimesheetAttendanceRequest = {
  id?: string;
  hours?: string;
  remarks?: string;
  workDate?: string;
  userId: string;
  project?: string;
  task?: string;
  subtask?: string;
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
