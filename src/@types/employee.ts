import { User } from './nistuser';
import { HRProject } from './hrproject';
import { HRTask } from './hrtask';
import { HRSubtask } from './hrsubtask';


export type Employee = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
};
export type EmployeeRequest = {
  id?: string;
  hours?: string;
  remarks?: string;
  workDate?: string;
  userId: string;
  projectsId: string;
  taskId: string;
  subtaskId: string;
};

export type EmployeeState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  employees: Employee[];
  employee: Employee | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedEmployeeName: string;
};
