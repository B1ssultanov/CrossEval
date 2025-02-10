import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mode } from "@/types/mode";

interface ModeState {
  mode: Mode;
}

const initialState: ModeState = {
  mode: "student", // Default mode (avoids SSR issues)
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "student" ? "supervisor" : "student";
      if (typeof window !== "undefined") {
        localStorage.setItem("mode", state.mode);
      }
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("mode", state.mode);
      }
    },
  },
});

export const { toggleMode, setMode } = modeSlice.actions;
export default modeSlice.reducer;
