import { loginUserApi, logoutApi, TLoginData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'user/login',
  async (payload: TLoginData) => loginUserApi(payload)
);

export const logout = createAsyncThunk('user/logout', async () => logoutApi());
