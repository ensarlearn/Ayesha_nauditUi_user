import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Softwares, SoftwaresRequest, SoftwaresState } from 'src/@types/softwares';
// import SoftwareService from 'src/services/software.service';
import { StatusCodes } from 'src/utils/status-codes';
import { extractErrorMessage } from 'src/utils/errorHelper';
import axios from 'src/utils/axios';
// import softwareService from 'src/services/software.service';

const initialState: SoftwaresState = {
    loadingStatus: StatusCodes.NONE,
    createStatus: StatusCodes.NONE,
    updateStatus: StatusCodes.NONE,
    statusChangeStatus: StatusCodes.NONE,
    deleteStatus: StatusCodes.NONE,
    error: false,
    errorMessage: null,
    softwares: [],
    software: null,
    sortBy: null,
    filters: {
        name: '',
    },
    selectedSoftwaresName: '',
};

const slice = createSlice({
    name: 'softwares',
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

          getSoftwareSuccess(state, action) {
            state.loadingStatus = StatusCodes.COMPLETED;
            state.software = action.payload;
          },

          getSoftwaresSuccess(state, action) {
            state.loadingStatus = StatusCodes.COMPLETED;
            state.softwares = action.payload;
            console.log(state.softwares);
          },

          addSoftwaresSuccess(state, action) {
            state.createStatus = StatusCodes.COMPLETED;
            state.softwares.push(action.payload);
          },

          updateSoftwaresSuccess(state, action) {
            state.updateStatus = StatusCodes.COMPLETED;
            const softwaresIndex = state.softwares.findIndex(
              (softwares: Softwares) => softwares.id === action.payload.id
            );
            state.softwares[softwaresIndex] = action.payload;
          },
      
          deleteSoftwaresSuccess(state, action) {
            state.deleteStatus = StatusCodes.COMPLETED;
            const idx = state.softwares.findIndex((softwares: Softwares) => softwares.id === action.payload);
            if (idx > -1) {
              state.softwares.splice(idx, 1);
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

      export function getSoftwares() {
        return async () => {
            dispatch(slice.actions.startLoading());
            try {
                const response = await axios.get('http://localhost:8080/v1/software/');
                dispatch(slice.actions.getSoftwareSuccess(response.data));
            } catch (error) {
                dispatch(slice.actions.hasError(error));
            }
        };
      }

      export function addSoftwares(software: SoftwaresRequest) {
        return async () => {
          dispatch(slice.actions.startCreating());
          try {
            const response = await axios.post('http://localhost:8080/v1/software/', software);
            dispatch(slice.actions.addSoftwaresSuccess(response.data));
          } catch (error) {
            dispatch(slice.actions.hasError(error));
          }
        };
      }
      

      export function updateSoftwares(software: SoftwaresRequest) {
        return async () => {
            dispatch(slice.actions.startCreating());
            try {
                const response = await axios.put('http://localhost:8080/v1/software/' + software.id, software);
                dispatch(slice.actions.updateSoftwaresSuccess(response.data));
            } catch (error) {
                dispatch(slice.actions.hasError(error));
            }
        };
      }

      export function deleteSoftwares(id: string) {
        return async () => {
          dispatch(slice.actions.startCreating());
          try {
            const response = await axios.delete('http://localhost:8080/v1/software/' + id);
            dispatch(slice.actions.deleteSoftwaresSuccess(id));
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
      




      
