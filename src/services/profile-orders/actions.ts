import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getProfileOrders = createAsyncThunk(
  'profile-orders/all',
  async () => getOrdersApi()
);
