import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { LinkedinLead, LinkedinLeadRequest, LinkedinLeadState } from '../../@types/linkedinlead';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: LinkedinLeadState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  linkedinLeads: [],
  linkedinLead: null,
  sortBy: null,
  filters: {
    websiteLink: '',
  },
  selectedLinkedinLeadsName: '',
};

const slice = createSlice({
  name: 'linkedinLead',
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

    getLinkedinLeadsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.linkedinLeads = action.payload;
    },

    getLinkedinLeadSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.linkedinLead = action.payload;
    },

    addLinkedinLeadSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.linkedinLeads.push(action.payload);
    },

    updateLinkedinLeadSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const linkedinLeadIndex = state.linkedinLeads.findIndex(
        (linkedinLead: LinkedinLead) => linkedinLead.id === action.payload.id
      );
      state.linkedinLeads[linkedinLeadIndex] = action.payload;
    },

    deleteLinkedinLeadSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.linkedinLeads.findIndex(
        (linkedinLead: LinkedinLead) => linkedinLead.id === action.payload
      );
      if (idx > -1) {
        state.linkedinLeads.splice(idx, 1);
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

export function getLinkedinLead() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await LinkedinLeadService.getLinkedinLeads(selectedOrg);
      const response = await axios.get('/v1/linkedinLead/');
      dispatch(slice.actions.getLinkedinLeadsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addLinkedinLead(linkedinLead: LinkedinLeadRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/linkedinLead/', linkedinLead);
      dispatch(slice.actions.addLinkedinLeadSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateLinkedinLead(linkedinLead: LinkedinLeadRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/linkedinLead/' + linkedinLead.id, linkedinLead);
      dispatch(slice.actions.updateLinkedinLeadSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteLinkedinLead(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/linkedinLead/' + id);
      dispatch(slice.actions.deleteLinkedinLeadSuccess(id));
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
