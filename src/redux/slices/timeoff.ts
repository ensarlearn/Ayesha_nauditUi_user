import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Timeoff, TimeoffRequest, TimeoffState } from '../../@types/timeoff';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: TimeoffState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  timeoffs: [],
  timeoff: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedTimeoffName: '',
};

const slice = createSlice({
  name: 'timeoff',
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

    getTimeoffsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.timeoffs = action.payload;
    },

    getTimeoffSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.timeoff = action.payload;
    },

    addTimeoffSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.timeoffs.push(action.payload);
    },

    updateTimeoffSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const timeoffIndex = state.timeoffs.findIndex(
        (timeoff: Timeoff) => timeoff.id === action.payload.id
      );
      state.timeoffs[timeoffIndex] = action.payload;
    },

    deleteTimeoffSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.timeoffs.findIndex(
        (timeoff: Timeoff) => timeoff.id === action.payload
      );
      if (idx > -1) {
        state.timeoffs.splice(idx, 1);
      }
    },

    resetStatus(state) {
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

export function getTimeoff() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/timeoff/');
      dispatch(slice.actions.getTimeoffsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addTimeoff(timeoff: TimeoffRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/timeoff/', timeoff);
      dispatch(slice.actions.addTimeoffSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateTimeoff(timeoff: TimeoffRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/timeoff/' + timeoff.id, timeoff);
      dispatch(slice.actions.updateTimeoffSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteTimeoff(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/timeoff/' + id);
      dispatch(slice.actions.deleteTimeoffSuccess(id));
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
