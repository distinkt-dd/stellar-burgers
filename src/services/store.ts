import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  burgerConstructorSlice,
  feedsSlice,
  ingredientsSlice,
  orderSlice,
  ordersSlice,
  passwordSlice
} from '@slices';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './user/slice';

const rootReducer = combineSlices(
  userSlice,
  passwordSlice,
  ingredientsSlice,
  burgerConstructorSlice,
  feedsSlice,
  orderSlice,
  ordersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
