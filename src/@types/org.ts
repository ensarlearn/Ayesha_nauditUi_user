export type Organization = {
  id: string;
  name?: string;
  dashBoardId?: string;
  description?: string;
  disabled?: boolean;
  domain?: string;
  logoImgSrc?: string;
};

export type OrganizationState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  organizations: Organization[];
  organization: Organization | null;
  sortBy: string | null;
  filters: {
    url: string;
  };
  selectedOrg: string;
};
