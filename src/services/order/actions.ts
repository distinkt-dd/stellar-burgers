import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearConstructor } from '@slices';

export const sendOrder = createAsyncThunk(
  'order/send',
  async (payload: string[], { dispatch }) => {
    const response = await orderBurgerApi(payload);
    if (response) {
      dispatch(clearConstructor());
    }
    return response;
  }
);
