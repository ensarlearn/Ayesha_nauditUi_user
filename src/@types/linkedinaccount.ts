import { User } from './nistuser';

export type LinkedinAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
  user: User;
  disabled?: boolean;
};

export type LinkedinAccountRequest = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userId: string;
  type?: string;
};

export type LinkedinAccountState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  linkedinAccounts: LinkedinAccount[];
  linkedinAccount: LinkedinAccount | null;
  sortBy: string | null;
  filters: {
    email: string;
  };
  selectedLinkedinAccountsName: string;
};
