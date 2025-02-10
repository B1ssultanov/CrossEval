import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "@/api/user";
import { AxiosError } from "axios";

// Define user structure
interface User {
  id: number | null;
  university_id: number | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  status: string | null;
  token: string | null;
}

// Define state structure
interface UserState extends User {
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  id: null,
  university_id: null,
  name: null,
  surname: null,
  email: null,
  status: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk to fetch current user
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const user: User = await fetchCurrentUser(); // No need to pass accessToken
    return user;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Failed to fetch user data."
    );
  }
});

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      Object.assign(state, initialState); // Reset user state to initial values
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        Object.assign(state, action.payload);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred.";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
