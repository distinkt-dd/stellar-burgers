import { sendOrder } from '@actions';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderResponseData = {
  orderRequest: boolean;
  order: TOrder | null;
  name: string | null;
};

const initialState: TOrderResponseData = {
  orderRequest: false,
  order: null,
  name: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderRequest = false;
      state.order = null;
    }
  },
  selectors: {
    selectNewOrder: (state) => state.order,
    selectNewOrderRequest: (state) => state.orderRequest,
    selectNewOrderName: (state) => state.name
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(sendOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.order;
        state.name = action.payload.name;
      });
  }
});

export const { selectNewOrder, selectNewOrderName, selectNewOrderRequest } =
  orderSlice.selectors;

export const { clearOrderModalData } = orderSlice.actions;
