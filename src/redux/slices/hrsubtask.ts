import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRSubtask, HRSubtaskRequest, HRSubtaskState } from '../../@types/hrsubtask';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

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
    startDeleting(state) {
      state.deleteStatus = StatusCodes.REQUESTED;
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
      const hrSubtaskIndex = state.hrSubtasks.findIndex(
        (hrSubtask: HRSubtask) => hrSubtask.id === action.payload.id
      );
      state.hrSubtasks[hrSubtaskIndex] = action.payload;
    },

    deleteHRSubtaskSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.hrSubtasks.findIndex(
        (hrSubtask: HRSubtask) => hrSubtask.id === action.payload
      );
      if (idx > -1) {
        state.hrSubtasks.splice(idx, 1);
      }
    },

    resetSubtask(state) {
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

export function getHRSubtask() {
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

export function addHRSubtask(hrSubtask: HRSubtaskRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/hrsubtask/', hrSubtask);
      dispatch(slice.actions.addHRSubtaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRSubtask(hrSubtask: HRSubtaskRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrsubtask/' + hrSubtask.id, hrSubtask);
      dispatch(slice.actions.updateHRSubtaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHRSubtask(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/hrsubtask/' + id);
      dispatch(slice.actions.deleteHRSubtaskSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function resetSubtask() {
  return async () => {
    dispatch(slice.actions.resetSubtask());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
