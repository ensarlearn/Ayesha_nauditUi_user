import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Crm, CrmRequest, CrmState } from '../../@types/crm';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: CrmState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  crms: [],
  crm: null,
  sortBy: null,
  filters: {
    email: '',
  },
  selectedCrmsName: '',
};

const slice = createSlice({
  name: 'crm',
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

    getCrmsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.crms = action.payload;
    },

    getCrmSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.crm = action.payload;
    },

    addCrmSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.crms.push(action.payload);
    },

    updateCrmSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const crmIndex = state.crms.findIndex(
        (crm: Crm) => crm.id === action.payload.id
      );
      state.crms[crmIndex] = action.payload;
    },

    deleteCrmSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.crms.findIndex(
        (crm: Crm) => crm.id === action.payload
      );
      if (idx > -1) {
        state.crms.splice(idx, 1);
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

export function getCrm() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await CrmService.getCrms(selectedOrg);
      const response = await axios.get('/v1/crm/');
      dispatch(slice.actions.getCrmsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addCrm(crm: CrmRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/crm/', crm);
      dispatch(slice.actions.addCrmSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCrm(crm: CrmRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/crm/' + crm.id, crm);
      dispatch(slice.actions.updateCrmSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteCrm(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/crm/' + id);
      dispatch(slice.actions.deleteCrmSuccess(id));
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
