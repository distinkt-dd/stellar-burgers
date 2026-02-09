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
  }
});
