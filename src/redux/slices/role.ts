import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Role, RoleRequest, RoleState } from '../../@types/role';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: RoleState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  roles: [],
  role: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedRolesName: '',
};

const slice = createSlice({
  name: 'role',
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
    startDeleting(state) {
      state.deleteStatus = StatusCodes.REQUESTED;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.errorMessage = extractErrorMessage(action.payload);
    },

    getRolesSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.roles = action.payload;
    },

    getRoleSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.role = action.payload;
    },

    addRoleSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.roles.push(action.payload);
    },

    updateRoleSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const roleIndex = state.roles.findIndex(
        (role: Role) => role.id === action.payload.id
      );
      state.roles[roleIndex] = action.payload;
    },

    deleteRoleSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.roles.findIndex(
        (role: Role) => role.id === action.payload
      );
      if (idx > -1) {
        state.roles.splice(idx, 1);
      }
    },

    resetRole(state) {
      state.updateStatus = StatusCodes.NONE;
      state.createStatus = StatusCodes.NONE;
      state.deleteStatus = StatusCodes.NONE;
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

export function getRole() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await RoleService.getRoles(selectedOrg);
      const response = await axios.get('/v1/role/');
      dispatch(slice.actions.getRolesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addRole(role: RoleRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/role/', role);
      dispatch(slice.actions.addRoleSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateRole(role: RoleRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/role/' + role.id, role);
      dispatch(slice.actions.updateRoleSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteRole(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/role/' + id);
      dispatch(slice.actions.deleteRoleSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function resetRole() {
  return async () => {
    dispatch(slice.actions.resetRole());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
