import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import userReducer from './slices/user';
import systemsReducer from './slices/systems';
import hrstatusReducer from './slices/hrstatus';
import hrtimesheetattendanceReducer from './slices/hrtimesheetattendance';
import hrprojectReducer from './slices/hrproject';
import hrtaskReducer from './slices/hrtask';
import hrsubtaskReducer from './slices/hrtask';
import softwaresReducer from './slices/software';
import controlsReducer from './slices/controls';
import featuresReducer from './slices/feature';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const systemsPersistConfig = {
  key: 'systems',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const hrStatusPersistConfig = {
  key: 'hrstatus',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const hrTimesheetAttendancePersistConfig = {
  key: 'hrtimesheetattendance',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const hrProjectPersistConfig = {
  key: 'hrproject',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const hrTaskPersistConfig = {
  key: 'hrtask',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const hrSubtaskPersistConfig = {
  key: 'hrsubtask',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const softwaresPersistConfig = {
  key: 'softwares',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const controlsPersistConfig = {
  key: 'controls',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const featuresPersistConfig = {
  key: 'features',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  user: persistReducer(userPersistConfig, userReducer),
  product: persistReducer(productPersistConfig, productReducer),
  systems: persistReducer(systemsPersistConfig, systemsReducer),
  hrstatus: persistReducer(hrStatusPersistConfig, hrstatusReducer),
  hrtimesheetattendance: persistReducer(hrTimesheetAttendancePersistConfig, hrtimesheetattendanceReducer),
  hrproject: persistReducer(hrProjectPersistConfig, hrprojectReducer),
  hrtask: persistReducer(hrTaskPersistConfig, hrtaskReducer),
  hrsubtask: persistReducer(hrSubtaskPersistConfig, hrsubtaskReducer),
  softwares: persistReducer(softwaresPersistConfig, softwaresReducer),
  controls: persistReducer(controlsPersistConfig, controlsReducer),
  features: persistReducer(featuresPersistConfig, featuresReducer),
});

export { rootPersistConfig, rootReducer };
