export type Crm = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  joinDate: Date | string | number;
  type: string;
  disabled?: boolean;
};

export type CrmRequest = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  joinDate?: string;
  password?: string;
  type?: string;
};

export type CrmState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  crms: Crm[];
  crm: Crm | null;
  sortBy: string | null;
  filters: {
    email: string;
  };
  selectedCrmsName: string;
};
