import { getProfileOrders } from '@actions';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersResponseInitialState = {
  orders: TOrder[] | [];
  isResponse: boolean;
  currentOrder: TOrder | null;
};

const initialState: TOrdersResponseInitialState = {
  orders: [],
  isResponse: false,
  currentOrder: null
};

export const ordersSlice = createSlice({
  name: 'profile-orders',
  initialState,
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersIsResponse: (state) => state.isResponse,
    selectProfileCurrentOrder: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(getProfileOrders.rejected, (state) => {
        state.isResponse = false;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isResponse = false;
      });
  }
});

export const {
  selectProfileCurrentOrder,
  selectProfileOrders,
  selectProfileOrdersIsResponse
} = ordersSlice.selectors;

export const ordersInitialState = initialState;
