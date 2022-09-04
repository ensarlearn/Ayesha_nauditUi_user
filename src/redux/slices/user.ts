import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { User, UserState } from '../../@types/nistuser';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from '../../utils/axios';

const initialState: UserState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  users: [],
  user: null,
  sortBy: null,
  filters: {
    url: '',
  },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.loadingStatus = StatusCodes.REQUESTED;
    },
    startCreating(state) {
      state.createStatus = StatusCodes.REQUESTED;
    },
    startUpdating(state) {
      state.updateStatus = StatusCodes.REQUESTED;
    },
    startStatusChanging(state) {
      state.statusChangeStatus = StatusCodes.REQUESTED;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.errorMessage = extractErrorMessage(action.payload);
    },

    getUsersSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.users = action.payload;
    },

    getUserSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.user = action.payload;
    },

    addUserSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.users.push(action.payload);
    },

    updateUserSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const userIndex = state.users.findIndex((user) => user.id === action.payload.id);
      state.users[userIndex] = action.payload;
    },

    statusChangeSuccess(state, action) {
      state.statusChangeStatus = StatusCodes.COMPLETED;
      const { ids, disable } = action.payload;
      const disabledUsers = state.users.filter((user) => ids.includes(user.id));
      disabledUsers.forEach((user) => (user.disabled = disable));
    },

    resetStatus(state) {
      state.updateStatus = StatusCodes.NONE;
      state.createStatus = StatusCodes.NONE;
      state.statusChangeStatus = StatusCodes.NONE;
      state.error = false;
      state.errorMessage = null;
    },
    resetError(state) {
      state.error = false;
      state.errorMessage = null;
    },
  },
});

// Reducer
export default slice.reducer;

export function getUsers(selectedOrg?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await UserService.getUsers(selectedOrg);
      const response = await axios.get('/v1/user/');
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCurrentUser() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/user');
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addUser(
  firstName: string,
  lastName: string,
  email: string,
  organizationId: string,
  role: string
) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.get('/v1/user');
      dispatch(slice.actions.addUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUser(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  organizationId: string
) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.get('/v1/user');
      dispatch(slice.actions.updateUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUserStatus(users: Array<User>, disable: boolean) {
  return async () => {
    dispatch(slice.actions.startStatusChanging());
    const ids = users.map((user) => user.id);
    try {
      //disable ? await UserService.disableUsers(ids) : await UserService.enableUsers(ids);
      dispatch(slice.actions.statusChangeSuccess({ ids, disable }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function resetStatus() {
  return async () => {
    dispatch(slice.actions.resetStatus());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
