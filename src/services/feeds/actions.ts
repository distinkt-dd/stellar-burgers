import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const feedsGetAll = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);
