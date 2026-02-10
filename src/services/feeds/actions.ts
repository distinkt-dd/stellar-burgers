import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const feedsGetAll = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const feedsOrderByNumber = createAsyncThunk(
  'feeds/getByNuber',
  async (number: number) => getOrderByNumberApi(number)
);
