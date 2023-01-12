import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Employee, EmployeeRequest, EmployeeState } from '../../@types/employee';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: EmployeeState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  employees: [],
  employee: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedEmployeeName: '',
};

const slice = createSlice({
  name: 'employee',
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

    getEmployeesSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.employees = action.payload;
    },

    getEmployeeSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.employee = action.payload;
    },

    addEmployeeSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.employees.push(action.payload);
    },

    updateEmployeeSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const employeeIndex = state.employees.findIndex(
        (employee: Employee) => employee.id === action.payload.id
      );
      state.employees[employeeIndex] = action.payload;
    },

    deleteEmployeeSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.employees.findIndex(
        (employee: Employee) => employee.id === action.payload
      );
      if (idx > -1) {
        state.employees.splice(idx, 1);
      }
    },

    resetEmployee(state) {
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

export function getEmployee() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/user/');
      dispatch(slice.actions.getEmployeesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addEmployee(employee: EmployeeRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('/v1/user/', employee);
      dispatch(slice.actions.addEmployeeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateEmployee(employee: EmployeeRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('/v1/user/updateuser/' + employee.id, employee);
      dispatch(slice.actions.updateEmployeeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteEmployee(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('/v1/user/' + id);
      dispatch(slice.actions.deleteEmployeeSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function resetEmployee() {
  return async () => {
    dispatch(slice.actions.resetEmployee());
  };
}

export function resetError() {
  return async () => {
    dispatch(slice.actions.resetError());
  };
}
