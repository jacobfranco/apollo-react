
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface AppState {
  // Define types for the state properties
}

// Define the initial state using that type
const initialState: AppState = {
  // Set the initial state values
};

// Create a slice for the app features
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Define reducers and corresponding actions
  },
});

// export const { /* export actions here */ } = appSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchUserData(123))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const fetchUserData = userId => dispatch => {
//   // Async logic here
// };

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Export the store's dispatch and selector hooks correctly typed for this application
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default store;
