import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { HRProject, HRProjectState } from '../../@types/hrproject';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from '../../utils/axios';

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
      const hrprojectIndex = state.hrProjects.findIndex((hrProject) => hrProject.id === action.payload.id);
      state.hrProjects[hrprojectIndex] = action.payload;
    },

    statusChangeSuccess(state, action) {
      state.statusChangeStatus = StatusCodes.COMPLETED;
      const { ids, disable } = action.payload;
      const disabledHRProjects = state.hrProjects.filter((hrProject) => ids.includes(hrProject.id));
      disabledHRProjects.forEach((hrProject) => (hrProject.disabled = disable));
    },

    resetStatus(state) {
      state.updateStatus = StatusCodes.NONE;
      state.createStatus = StatusCodes.NONE;
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

export function getHRProjects(selectedOrg?: string) {
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

export function getCurrentHRProject() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/hrproject/current');
      dispatch(slice.actions.getHRProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addHRProject(
  firstName: string,
  lastName: string,
  email: string,
  organizationId: string,
  role: string
) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const data: any = {
        firstName,
        lastName,
        email,
        role,
      };
      const response = await axios.post('/v1/hrproject/', data);
      dispatch(slice.actions.addHRProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRProject(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  organizationId: string
) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/hrproject/', {
        firstName,
        lastName,
        email,
        role,
        organizationId,
      });
      dispatch(slice.actions.updateHRProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateHRProjectStatus(hrprojects: Array<HRProject>, disable: boolean) {
  return async () => {
    dispatch(slice.actions.startStatusChanging());
    const ids = hrprojects.map((hrproject) => hrproject.id);
    try {
      //disable ? await HRProjectService.disableHRProjects(ids) : await HRProjectService.enableHRProjects(ids);
      dispatch(slice.actions.statusChangeSuccess({ ids, disable }));
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
