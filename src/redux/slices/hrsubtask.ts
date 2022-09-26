import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRSubtask, HRSubtaskState } from '../../@types/hrsubtask';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from '../../utils/axios';

const initialState: HRSubtaskState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  hrSubtasks: [],
  hrSubtask: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedHRSubtaskName: '',
};


const slice = createSlice({
  name: 'hrsubtask',
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

    getHRSubtasksSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrSubtasks = action.payload;
    },

    getHRSubtaskSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrSubtask = action.payload;
    },

    addHRSubtaskSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.hrSubtasks.push(action.payload);
    },

    updateHRSubtaskSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const hrsubtaskIndex = state.hrSubtasks.findIndex((hrSubtask) => hrSubtask.id === action.payload.id);
      state.hrSubtasks[hrsubtaskIndex] = action.payload;
    },

    statusChangeSuccess(state, action) {
      state.statusChangeStatus = StatusCodes.COMPLETED;
      const { ids, disable } = action.payload;
      const disabledHRSubtasks = state.hrSubtasks.filter((hrSubtask) => ids.includes(hrSubtask.id));
      disabledHRSubtasks.forEach((hrSubtask) => (hrSubtask.disabled = disable));
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

export function getHRSubtasks(selectedOrg?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await HRSubtaskService.getHRSubtasks(selectedOrg);
      const response = await axios.get('/v1/hrsubtask/');
      dispatch(slice.actions.getHRSubtasksSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCurrentHRSubtask() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/hrsubtask/current');
      dispatch(slice.actions.getHRSubtaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRSubtask(
  firstName: string,
  lastName: string,
  email: string,
  organizationId: string,
  role: string
) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const data: any = {
        firstName,
        lastName,
        email,
        role,
      };
      const response = await axios.post('/v1/hrsubtask/', data);
      dispatch(slice.actions.addHRSubtaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRSubtask(
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
      const response = await axios.put('/v1/hrsubtask/', {
        firstName,
        lastName,
        email,
        role,
        organizationId,
      });
      dispatch(slice.actions.updateHRSubtaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRSubtaskStatus(hrsubtasks: Array<HRSubtask>, disable: boolean) {
  return async () => {
    dispatch(slice.actions.startStatusChanging());
    const ids = hrsubtasks.map((hrsubtask) => hrsubtask.id);
    try {
      //disable ? await HRSubtaskService.disableHRSubtasks(ids) : await HRSubtaskService.enableHRSubtasks(ids);
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
