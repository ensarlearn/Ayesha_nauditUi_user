import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Department, DepartmentRequest, DepartmentState } from '../../@types/department';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: DepartmentState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  departments: [],
  department: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedDepartmentsName: '',
};

const slice = createSlice({
  name: 'department',
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

    getDepartmentsSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.departments = action.payload;
    },

    getDepartmentSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.department = action.payload;
    },

    addDepartmentSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.departments.push(action.payload);
    },

    updateDepartmentSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const departmentIndex = state.departments.findIndex(
        (department: Department) => department.id === action.payload.id
      );
      state.departments[departmentIndex] = action.payload;
    },

    deleteDepartmentSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.departments.findIndex(
        (department: Department) => department.id === action.payload
      );
      if (idx > -1) {
        state.departments.splice(idx, 1);
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

export function getDepartment() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      //const response = await DepartmentService.getDepartments(selectedOrg);
      const response = await axios.get('/v1/department/');
      dispatch(slice.actions.getDepartmentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addDepartment(department: DepartmentRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/department/', department);
      dispatch(slice.actions.addDepartmentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateDepartment(department: DepartmentRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/department/' + department.id, department);
      dispatch(slice.actions.updateDepartmentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteDepartment(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/department/' + id);
      dispatch(slice.actions.deleteDepartmentSuccess(id));
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
