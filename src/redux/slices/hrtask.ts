import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRTask, HRTaskRequest, HRTaskState } from '../../@types/hrtask';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

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
    startDeleting(state) {
      state.deleteStatus = StatusCodes.REQUESTED;
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
      const hrTaskIndex = state.hrTasks.findIndex(
        (hrTask: HRTask) => hrTask.id === action.payload.id
      );
      state.hrTasks[hrTaskIndex] = action.payload;
    },

    deleteHRTaskSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.hrTasks.findIndex(
        (hrTask: HRTask) => hrTask.id === action.payload
      );
      if (idx > -1) {
        state.hrTasks.splice(idx, 1);
      }
    },

    resetTask(state) {
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

export function getHRTask() {
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

export function addHRTask(hrTask: HRTaskRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/hrtask/', hrTask);
      dispatch(slice.actions.addHRTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRTask(hrTask: HRTaskRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrtask/' + hrTask.id, hrTask);
      dispatch(slice.actions.updateHRTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHRTask(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/hrtask/' + id);
      dispatch(slice.actions.deleteHRTaskSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function resetTask() {
  return async () => {
    dispatch(slice.actions.resetTask());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
