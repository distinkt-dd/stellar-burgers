import { burgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  burgerApi.getIngredientsApi()
);
