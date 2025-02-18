import { createSlice } from "@reduxjs/toolkit";

interface FetchTriggerState {
  shouldFetch: boolean;
}

const initialState: FetchTriggerState = {
  shouldFetch: false,
};

const fetchTriggerSlice = createSlice({
  name: "fetchTrigger",
  initialState,
  reducers: {
    triggerFetch: (state) => {
      state.shouldFetch = !state.shouldFetch; // Toggle state to force re-fetch
    },
  },
});

export const { triggerFetch } = fetchTriggerSlice.actions;
export default fetchTriggerSlice.reducer;
