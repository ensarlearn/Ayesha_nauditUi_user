import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Controls, ControlsRequest, ControlsState } from '../../@types/controls';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: ControlsState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  controls: [],
  control: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedControlsName: '',
};

const slice = createSlice({
  name: 'controls',
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

    getControlSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.control = action.payload;
    },

    getControlsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.controls = action.payload;
      console.log(state.controls);
    },

    addControlsSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.controls.push(action.payload);
    },

    updateControlsSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const controlsIndex = state.controls.findIndex(
        (controls: Controls) => controls.id === action.payload.id
      );
      state.controls[controlsIndex] = action.payload;
    },

    deleteControlsSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.controls.findIndex((controls: Controls) => controls.id === action.payload);
      if (idx > -1) {
        state.controls.splice(idx, 1);
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

export function getControls() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/Controls/');
      dispatch(slice.actions.getControlsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addControls(control: ControlsRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('', control);
      dispatch(slice.actions.addControlsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateControls(control: ControlsRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/controls/' + control.id, control);
      dispatch(slice.actions.updateControlsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteControls(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/controls/' + id);
      dispatch(slice.actions.deleteControlsSuccess(id));
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