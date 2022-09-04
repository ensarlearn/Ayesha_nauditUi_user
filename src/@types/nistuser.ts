import { Organization } from './org';

export type User = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  organization?: Organization;
  lastLoginDateTime?: string;
  password?: string;
  photoURL?: File | any;
  phoneNumber?: string | null;
  country?: string | null;
  address?: string | null;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  about?: string | null;
  role?: string;
  disabled?: boolean;
  isPublic?: boolean;
};

export type UserState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  users: User[];
  user: User | null;
  sortBy: string | null;
  filters: {
    url: string;
  };
};
