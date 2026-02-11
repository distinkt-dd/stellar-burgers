import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendOrder = createAsyncThunk(
  'order/send',
  async (payload: string[]) => orderBurgerApi(payload)
);
