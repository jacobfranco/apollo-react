// src/reducers/index.ts

import authReducer from './auth';
import settingsReducer from './settings';

export default {
  auth: authReducer,
  settings: settingsReducer,
  // Add other reducers here as they are created
};
