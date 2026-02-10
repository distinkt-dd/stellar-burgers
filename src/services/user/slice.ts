import { login, logout, register } from '@actions';
import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  error: string | null;
  isAuthChecked: boolean;
};

export const initialState: UserState = {
  user: null,
  error: null,
  isAuthChecked: false
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
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = String(action.error.message);
        state.isAuthChecked = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(register.fulfilled, (state, actions) => {
        state.user = actions.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = String(action.error.message);
        state.isAuthChecked = true;
      });
  }
});

export const { selectUser, selectIsAuthChecked, selectUserError } =
  userSlice.selectors;

export const { setUser, setIsAuthChecked } = userSlice.actions;
