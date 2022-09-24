import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRStatus, HRStatusRequest, HRStatusState } from '../../@types/hrstatus';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: HRStatusState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  hrStatuses: [],
  hrStatus: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedHRStatusName: '',
};

const slice = createSlice({
  name: 'hrstatus',
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

    getHRStatusesSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrStatuses = action.payload;
    },

    getHRStatusSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrStatus = action.payload;
    },

    addHRStatusSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.hrStatuses.push(action.payload);
    },

    updateHRStatusSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const hrStatusIndex = state.hrStatuses.findIndex(
        (hrStatus: HRStatus) => hrStatus.id === action.payload.id
      );
      state.hrStatuses[hrStatusIndex] = action.payload;
    },

    deleteHRStatusSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.hrStatuses.findIndex(
        (hrStatus: HRStatus) => hrStatus.id === action.payload
      );
      if (idx > -1) {
        state.hrStatuses.splice(idx, 1);
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

export function getHRStatus() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/hrstatus/');
      dispatch(slice.actions.getHRStatusesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRStatus(hrStatus: HRStatusRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/hrstatus/', hrStatus);
      dispatch(slice.actions.addHRStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRStatus(hrStatus: HRStatusRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrstatus/' + hrStatus.id, hrStatus);
      dispatch(slice.actions.updateHRStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHRStatus(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/hrstatus/' + id);
      dispatch(slice.actions.deleteHRStatusSuccess(id));
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
