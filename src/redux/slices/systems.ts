import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Systems, SystemsRequest, SystemsState } from '../../@types/systems';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: SystemsState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  systems: [],
  system: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedSystemsName: '',
};

const slice = createSlice({
  name: 'systems',
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

    getSystemSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.system = action.payload;
    },

    getSystemsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.systems = action.payload;

      //console.log(state.systems);
    },

    addSystemsSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.systems.push(action.payload);
    },

    updateSystemsSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const systemsIndex = state.systems.findIndex(
        (systems: Systems) => systems.id === action.payload.id
      );
      state.systems[systemsIndex] = action.payload;
    },

    deleteSystemsSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.systems.findIndex((systems: Systems) => systems.id === action.payload);
      if (idx > -1) {
        state.systems.splice(idx, 1);
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

export function getSystems() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/systems/');
      dispatch(slice.actions.getSystemsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addSystems(system: SystemsRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/systems/', system);
      dispatch(slice.actions.addSystemsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateSystems(system: SystemsRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/systems/' + system.id, system);
      dispatch(slice.actions.updateSystemsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteSystems(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/systems/' + id);
      dispatch(slice.actions.deleteSystemsSuccess(id));
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
