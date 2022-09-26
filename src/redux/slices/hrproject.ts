import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRProject, HRProjectRequest, HRProjectState } from '../../@types/hrproject';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: HRProjectState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  hrProjects: [],
  hrProject: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedHRProjectName: '',
};

const slice = createSlice({
  name: 'hrproject',
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

    getHRProjectsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrProjects = action.payload;
    },

    getHRProjectSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.hrProject = action.payload;
    },

    addHRProjectSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.hrProjects.push(action.payload);
    },

    updateHRProjectSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const hrProjectIndex = state.hrProjects.findIndex(
        (hrProject: HRProject) => hrProject.id === action.payload.id
      );
      state.hrProjects[hrProjectIndex] = action.payload;
    },

    deleteHRProjectSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.hrProjects.findIndex(
        (hrProject: HRProject) => hrProject.id === action.payload
      );
      if (idx > -1) {
        state.hrProjects.splice(idx, 1);
      }
    },

    resetProject(state) {
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

export function getHRProject() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await HRProjectService.getHRProjects(selectedOrg);
      const response = await axios.get('/v1/hrproject/');
      dispatch(slice.actions.getHRProjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRProject(hrProject: HRProjectRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/hrproject/', hrProject);
      dispatch(slice.actions.addHRProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRProject(hrProject: HRProjectRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrproject/' + hrProject.id, hrProject);
      dispatch(slice.actions.updateHRProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteHRProject(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/hrproject/' + id);
      dispatch(slice.actions.deleteHRProjectSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function resetProject() {
  return async () => {
    dispatch(slice.actions.resetProject());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
