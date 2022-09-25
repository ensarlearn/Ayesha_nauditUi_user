import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRTimesheetAttendance, HRTimesheetAttendanceRequest, HRTimesheetAttendanceState } from '../../@types/hrtimesheetattendance';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: HRTimesheetAttendanceState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  hrTimesheetAttendances: [],
  hrTimesheetAttendance: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedHRTimesheetAttendanceName: '',
};

const slice = createSlice({
  name: 'hrtimesheetattendance',
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

    getHRTimesheetAttendancesSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrTimesheetAttendances = action.payload;
    },

    getHRTimesheetAttendanceSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrTimesheetAttendance = action.payload;
    },

    addHRTimesheetAttendanceSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.hrTimesheetAttendances.push(action.payload);
    },

    updateHRTimesheetAttendanceSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const hrTimesheetAttendanceIndex = state.hrTimesheetAttendances.findIndex(
        (hrTimesheetAttendance: HRTimesheetAttendance) => hrTimesheetAttendance.id === action.payload.id
      );
      state.hrTimesheetAttendances[hrTimesheetAttendanceIndex] = action.payload;
    },

    deleteHRTimesheetAttendanceSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.hrTimesheetAttendances.findIndex(
        (hrTimesheetAttendance: HRTimesheetAttendance) => hrTimesheetAttendance.id === action.payload
      );
      if (idx > -1) {
        state.hrTimesheetAttendances.splice(idx, 1);
      }
    },

    resetTimesheetAttendance(state) {
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

export function getHRTimesheetAttendance() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/hrtimesheetattendance/');
      dispatch(slice.actions.getHRTimesheetAttendancesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRTimesheetAttendance(hrTimesheetAttendance: HRTimesheetAttendanceRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/hrtimesheetattendance/', hrTimesheetAttendance);
      dispatch(slice.actions.addHRTimesheetAttendanceSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRTimesheetAttendance(hrTimesheetAttendance: HRTimesheetAttendanceRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrtimesheetattendance/' + hrTimesheetAttendance.id, hrTimesheetAttendance);
      dispatch(slice.actions.updateHRTimesheetAttendanceSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHRTimesheetAttendance(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/hrtimesheetattendance/' + id);
      dispatch(slice.actions.deleteHRTimesheetAttendanceSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function resetTimesheetAttendance() {
  return async () => {
    dispatch(slice.actions.resetTimesheetAttendance());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
