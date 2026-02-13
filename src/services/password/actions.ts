import { burgerApi, TForgotPassword, TResetPassword } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const forgot = createAsyncThunk(
  'password/forgot',
  async (payload: TForgotPassword) => burgerApi.forgotPasswordApi(payload)
);

export const reset = createAsyncThunk(
  'password/reset',
  async (paylod: TResetPassword) => burgerApi.resetPasswordApi(paylod)
);
