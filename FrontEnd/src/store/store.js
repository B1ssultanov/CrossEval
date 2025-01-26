import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer, // Add your reducers here
  },
  // Middleware is automatically set up with redux-thunk included
});
