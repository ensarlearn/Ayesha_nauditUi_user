import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Features, FeaturesRequest, FeaturesState } from '../../@types/features';
import { StatusCodes } from '../../utils/status-codes';
import { extractErrorMessage } from '../../utils/errorHelper';
import axios from 'src/utils/axios';

const initialState: FeaturesState = {
  loadingStatus: StatusCodes.NONE,
  createStatus: StatusCodes.NONE,
  updateStatus: StatusCodes.NONE,
  statusChangeStatus: StatusCodes.NONE,
  deleteStatus: StatusCodes.NONE,
  error: false,
  errorMessage: null,
  features: [],
  feature: null,
  sortBy: null,
  filters: {
    name: '',
  },
  selectedFeaturesName: '',
};

const slice = createSlice({
  name: 'features',
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

    getFeatureSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.feature = action.payload;
    },

    getFeaturesSuccess(state, action) {
      state.loadingStatus = StatusCodes.COMPLETED;
      state.features = action.payload;
      console.log(state.features);
    },

    addFeaturesSuccess(state, action) {
      state.createStatus = StatusCodes.COMPLETED;
      state.features.push(action.payload);
    },

    updateFeaturesSuccess(state, action) {
      state.updateStatus = StatusCodes.COMPLETED;
      const featuresIndex = state.features.findIndex(
        (features: Features) => features.id === action.payload.id
      );
      state.features[featuresIndex] = action.payload;
    },

    deleteFeaturesSuccess(state, action) {
      state.deleteStatus = StatusCodes.COMPLETED;
      const idx = state.features.findIndex((features: Features) => features.id === action.payload);
      if (idx > -1) {
        state.features.splice(idx, 1);
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

export function getFeatures() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/v1/features/');
      dispatch(slice.actions.getFeaturesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addFeatures(feature: FeaturesRequest) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.post('http://localhost:8080/v1/features/', feature);
      dispatch(slice.actions.addFeaturesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateFeatures(feature: FeaturesRequest) {
  return async () => {
    dispatch(slice.actions.startUpdating());
    try {
      const response = await axios.put('http://localhost:8080/v1/features/' + feature.id, feature);
      dispatch(slice.actions.updateFeaturesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteFeatures(id: string) {
  return async () => {
    dispatch(slice.actions.startCreating());
    try {
      const response = await axios.delete('http://localhost:8080/v1/features/' + id);
      dispatch(slice.actions.deleteFeaturesSuccess(id));
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
