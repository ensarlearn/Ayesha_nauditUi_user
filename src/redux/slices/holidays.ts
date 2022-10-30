import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Holidays, HolidaysRequest, HolidaysState } from '../../@types/holidays';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';
// @mui
import { Alert } from '@mui/material';

const initialState: HolidaysState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  uploadingStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  holidays: [],
  holiday: null,
  sortBy: null,
  filters: {
    title: '',
  },
  selectedHolidaysName: '',
};

const slice = createSlice({
  name: 'holidays',
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

    startUploading(state) {
      state.uploadingStatus = StatusCodes.REQUESTED;
    },
    hasError(state, action) {
      state.error = action.payload;
      state.errorMessage = extractErrorMessage(action.payload);
    },

    getHolidaySuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.holiday = action.payload;
    },

    getHolidaysSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.holidays = action.payload;

      //console.log(state.holidays);
    },

    addHolidaysSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.holidays.push(action.payload);
    },

    updateHolidaysSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const holidaysIndex = state.holidays.findIndex(
        (holidays: Holidays) => holidays.id === action.payload.id
      );
      state.holidays[holidaysIndex] = action.payload;
    },

    deleteHolidaysSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.holidays.findIndex((holidays: Holidays) => holidays.id === action.payload);
      if (idx > -1) {
        state.holidays.splice(idx, 1);
      }
    },

    resetStatus(state) {
      state.updateStatus = StatusCodes.NONE;
      state.uploadingStatus = StatusCodes.NONE;
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

export function getHolidays() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/holidays/');
      dispatch(slice.actions.getHolidaysSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHolidays(holiday: HolidaysRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/holidays/', holiday);
      dispatch(slice.actions.addHolidaysSuccess(response.data));
    } catch (error) {
      alert('not unique from redux');
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHolidays(holiday: HolidaysRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/holidays/' + holiday.id, holiday);
      dispatch(slice.actions.updateHolidaysSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHolidays(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/holidays/' + id);
      dispatch(slice.actions.deleteHolidaysSuccess(id));
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
