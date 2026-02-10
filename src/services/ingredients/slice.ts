import { getIngredients } from '@actions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsInitialState = {
  ingredients: TIngredient[] | undefined;
  isResponse: boolean;
  currentIngredient: TIngredient | null;
  error: string | null;
};

const initialState: TIngredientsInitialState = {
  ingredients: undefined,
  isResponse: false,
  currentIngredient: null,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.currentIngredient = action.payload;
    },

    deleteCurrentIngredient: (state) => {
      state.currentIngredient = null;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsError: (state) => state.error,
    selectIngredientsIsResponse: (state) => state.isResponse,
    selectCurrentIngredient: (state) => state.currentIngredient
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
  selectIngredientsError,
  selectCurrentIngredient
} = ingredientsSlice.selectors;

export const { setCurrentIngredient, deleteCurrentIngredient } =
  ingredientsSlice.actions;
