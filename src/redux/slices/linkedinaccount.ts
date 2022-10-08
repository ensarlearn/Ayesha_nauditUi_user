import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { LinkedinAccount, LinkedinAccountRequest, LinkedinAccountState } from '../../@types/linkedinaccount';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: LinkedinAccountState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  linkedinAccounts: [],
  linkedinAccount: null,
  sortBy: null,
  filters: {
    email: '',
  },
  selectedLinkedinAccountsName: '',
};

const slice = createSlice({
  name: 'linkedinAccount',
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

    getLinkedinAccountsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.linkedinAccounts = action.payload;
    },

    getLinkedinAccountSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.linkedinAccount = action.payload;
    },

    addLinkedinAccountSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.linkedinAccounts.push(action.payload);
    },

    updateLinkedinAccountSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const linkedinAccountIndex = state.linkedinAccounts.findIndex(
        (linkedinAccount: LinkedinAccount) => linkedinAccount.id === action.payload.id
      );
      state.linkedinAccounts[linkedinAccountIndex] = action.payload;
    },

    deleteLinkedinAccountSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.linkedinAccounts.findIndex(
        (linkedinAccount: LinkedinAccount) => linkedinAccount.id === action.payload
      );
      if (idx > -1) {
        state.linkedinAccounts.splice(idx, 1);
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

export function getLinkedinAccount() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await LinkedinAccountService.getLinkedinAccounts(selectedOrg);
      const response = await axios.get('/v1/linkedinAccount/');
      dispatch(slice.actions.getLinkedinAccountsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addLinkedinAccount(linkedinAccount: LinkedinAccountRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/linkedinAccount/', linkedinAccount);
      dispatch(slice.actions.addLinkedinAccountSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateLinkedinAccount(linkedinAccount: LinkedinAccountRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/linkedinAccount/' + linkedinAccount.id, linkedinAccount);
      dispatch(slice.actions.updateLinkedinAccountSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteLinkedinAccount(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/linkedinAccount/' + id);
      dispatch(slice.actions.deleteLinkedinAccountSuccess(id));
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
