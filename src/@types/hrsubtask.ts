import { User } from './nistuser';
import { HRTask } from './hrtask';
import { String } from 'lodash';

export type HRSubtask = {
  id: string;
  name: String;
  task: HRTask;
};

export type HRSubtaskRequest = {
  id?: string;
  name?: string;
  taskId: string;
};

export type HRSubtaskState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  hrSubtasks: HRSubtask[];
  hrSubtask: HRSubtask | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedHRSubtaskName: string;
};
