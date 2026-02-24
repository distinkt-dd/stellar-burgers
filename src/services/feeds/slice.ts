import { feedsGetAll } from '@actions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedTotal = {
  total: number | null;
  totalToday: number | null;
};

type TFeedsInitialState = {
  orders: TOrder[] | [];
  feed: TFeedTotal;
  error: string | null;
  currentOrder: TOrder | null;
};

const initialState: TFeedsInitialState = {
  orders: [],
  feed: {
    total: null,
    totalToday: null
  },
  error: null,
  currentOrder: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<TOrder>) => {
      state.currentOrder = action.payload;
    }
  },
  selectors: {
    getFeedsOrders: (state) => state.orders,
    getFeedsTotal: (state) => state.feed.total,
    getFeedsTotalToday: (state) => state.feed.totalToday,
    getFeed: (state) => state.feed,
    getCurrentOrder: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(feedsGetAll.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.error = null;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(feedsGetAll.pending, (state) => {
        state.orders = [];
        state.error = null;
      })
      .addCase(feedsGetAll.rejected, (state, action) => {
        state.error = String(action.error.message);
      });
  }
});

export const {
  getFeed,
  getFeedsOrders,
  getFeedsTotal,
  getFeedsTotalToday,
  getCurrentOrder
} = feedsSlice.selectors;

export const { setCurrentOrder } = feedsSlice.actions;
export const feedsInitialState = initialState;
