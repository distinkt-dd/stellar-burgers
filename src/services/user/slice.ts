import { login, logout, register } from '@actions';
import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  error: string | '';
  isAuthChecked: boolean;
  isResponse: boolean;
};

export const initialState: UserState = {
  user: null,
  error: '',
  isAuthChecked: false,
  isResponse: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserError: (state) => state.error,
    selectUserIsResponse: (state) => state.isResponse
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = '';
        state.isResponse = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = String(action.error.message);
        state.isAuthChecked = true;
        state.isResponse = false;
      })
      .addCase(login.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = '';
      })

      .addCase(register.fulfilled, (state, actions) => {
        state.user = actions.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = String(action.error.message);
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state) => {
        state.isResponse = true;
        state.error = '';
      });
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserError,
  selectUserIsResponse
} = userSlice.selectors;

export const { setUser, setIsAuthChecked } = userSlice.actions;
