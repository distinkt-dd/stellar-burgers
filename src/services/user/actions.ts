import { burgerApi, TLoginData, TRegisterData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setIsAuthChecked, setUser } from './slice';

export const register = createAsyncThunk(
  'user/register',
  async (payload: TRegisterData) => burgerApi.registerUserApi(payload)
);

export const login = createAsyncThunk(
  'user/login',
  async (payload: TLoginData) => burgerApi.loginUserApi(payload)
);

export const logout = createAsyncThunk('user/logout', async () =>
  burgerApi.logoutApi()
);

export const update = createAsyncThunk(
  'user/update',
  async (payload: TRegisterData) => burgerApi.updateUserApi(payload)
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (burgerApi.isTokenExists()) {
      burgerApi
        .getUserApi()
        .then((user) => dispatch(setUser(user?.user)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);
