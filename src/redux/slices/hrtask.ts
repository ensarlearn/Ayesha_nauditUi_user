import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRTask, HRTaskState } from '../../@types/hrtask';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from '../../utils/axios';

const initialState: HRTaskState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  hrTasks: [],
  hrTask: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedHRTasksName: '',
};


const slice = createSlice({
  name: 'hrtask',
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

    getHRTasksSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrTasks = action.payload;
    },

    getHRTaskSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrTask = action.payload;
    },

    addHRTaskSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.hrTasks.push(action.payload);
    },

    updateHRTaskSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const hrtaskIndex = state.hrTasks.findIndex((hrTask) => hrTask.id === action.payload.id);
      state.hrTasks[hrtaskIndex] = action.payload;
    },

    statusChangeSuccess(state, action) {
      state.statusChangeStatus = StatusCodes.COMPLETED;
      const { ids, disable } = action.payload;
      const disabledHRTasks = state.hrTasks.filter((hrTask) => ids.includes(hrTask.id));
      disabledHRTasks.forEach((hrTask) => (hrTask.disabled = disable));
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

export function getHRTasks(selectedOrg?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await HRTaskService.getHRTasks(selectedOrg);
      const response = await axios.get('/v1/hrtask/');
      dispatch(slice.actions.getHRTasksSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCurrentHRTask() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/hrtask/current');
      dispatch(slice.actions.getHRTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRTask(
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
      const response = await axios.post('/v1/hrtask/', data);
      dispatch(slice.actions.addHRTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRTask(
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
      const response = await axios.put('/v1/hrtask/', {
        firstName,
        lastName,
        email,
        role,
        organizationId,
      });
      dispatch(slice.actions.updateHRTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRTaskStatus(hrtasks: Array<HRTask>, disable: boolean) {
  return async () => {
    dispatch(slice.actions.startStatusChanging());
    const ids = hrtasks.map((hrtask) => hrtask.id);
    try {
      //disable ? await HRTaskService.disableHRTasks(ids) : await HRTaskService.enableHRTasks(ids);
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
