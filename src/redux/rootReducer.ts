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
import holidaysReducer from './slices/holidays';
import timeoffReducer from './slices/timeoff';
import hrstatusReducer from './slices/hrstatus';
import hrtimesheetattendanceReducer from './slices/hrtimesheetattendance';
import hrprojectReducer from './slices/hrproject';
import hrtaskReducer from './slices/hrtask';
import departmentReducer from './slices/department';
import linkedinleadReducer from './slices/linkedinlead';
import linkedinaccountReducer from './slices/linkedinaccount';
import crmReducer from './slices/crm';
import roleReducer from './slices/role';
import employeeReducer from './slices/employee';
import hrsubtaskReducer from './slices/hrsubtask';
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
const rolePersistConfig = {
  key: 'role',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const employeePersistConfig = {
  key: 'employee',
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
const holidaysPersistConfig = {
  key: 'holidays',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const timeoffPersistConfig = {
  key: 'timeoff',
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
const departmentPersistConfig = {
  key: 'department',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const linkedinleadPersistConfig = {
  key: 'linkedinlead',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy'],
};
const linkedinaccountPersistConfig = {
  key: 'linkedinaccount',
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
  role: persistReducer(rolePersistConfig, roleReducer),
  employee: persistReducer(employeePersistConfig, employeeReducer),
  product: persistReducer(productPersistConfig, productReducer),
  systems: persistReducer(systemsPersistConfig, systemsReducer),
  holidays: persistReducer(holidaysPersistConfig, holidaysReducer),
  timeoff: persistReducer(timeoffPersistConfig, timeoffReducer),
  hrstatus: persistReducer(hrStatusPersistConfig, hrstatusReducer),
  hrtimesheetattendance: persistReducer(hrTimesheetAttendancePersistConfig, hrtimesheetattendanceReducer),
  department: persistReducer(departmentPersistConfig, departmentReducer),
  linkedinlead: persistReducer(linkedinleadPersistConfig, linkedinleadReducer),
  linkedinaccount: persistReducer(linkedinaccountPersistConfig, linkedinaccountReducer),
  crm: persistReducer(linkedinaccountPersistConfig, crmReducer),
  hrproject: persistReducer(hrProjectPersistConfig, hrprojectReducer),
  hrtask: persistReducer(hrTaskPersistConfig, hrtaskReducer),
  hrsubtask: persistReducer(hrSubtaskPersistConfig, hrsubtaskReducer),
  softwares: persistReducer(softwaresPersistConfig, softwaresReducer),
  controls: persistReducer(controlsPersistConfig, controlsReducer),
  features: persistReducer(featuresPersistConfig, featuresReducer),
});

export { rootPersistConfig, rootReducer };
