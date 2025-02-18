import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modeReducer from "./slices/modeSlice";
import triggerFetchReducer from "./slices/triggerFetchSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    mode: modeReducer,
    fetchTrigger: triggerFetchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
