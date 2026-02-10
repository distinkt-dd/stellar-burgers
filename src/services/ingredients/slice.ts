import { getIngredients } from '@actions';
import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsInitialState = {
  ingredients: TIngredient[] | null;
  isResponse: boolean;
  error: string | null;
};

const initialState: TIngredientsInitialState = {
  ingredients: null,
  isResponse: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsError: (state) => state.error,
    selectIngredientsIsResponse: (state) => state.isResponse
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isResponse = false;
        state.error = String(action.error.message);
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isResponse = false;
        state.error = null;
        state.ingredients = action.payload;
      });
  }
});

export const {
  selectIngredients,
  selectIngredientsIsResponse,
  selectIngredientsError
} = ingredientsSlice.selectors;
