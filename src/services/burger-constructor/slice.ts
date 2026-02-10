import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

type TInitialStateBurgerConstructor = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const saveToLocalStorage = (state: TInitialStateBurgerConstructor) => {
  try {
    localStorage.setItem('burgerConstructor', JSON.stringify(state));
  } catch (e) {
    console.error(
      'Ошибка сохранения состояния конструктора в localStorage: ',
      e
    );
  }
};

const loadFromLocalStorage = (): TInitialStateBurgerConstructor => {
  try {
    const data = localStorage.getItem('burgerConstructor');
    if (data) {
      return JSON.parse(data) as TInitialStateBurgerConstructor;
    }
  } catch (e) {
    console.error(
      'Ошибка выгрузки данных burgerConstructor из localStorage',
      e
    );
  }
  return {
    bun: null,
    ingredients: []
  };
};

const initialState: TInitialStateBurgerConstructor = loadFromLocalStorage();

export const burgerConstructorSlice = createSlice({
  name: 'burger-constructor',
  initialState,
  reducers: {
    addConstructorIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients.push(action.payload);
      saveToLocalStorage(state);
    },
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
      saveToLocalStorage(state);
    },
    removeConstructorIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
      saveToLocalStorage(state);
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const indexIng = state.ingredients.findIndex(
        (ing) => ing.id === action.payload
      );

      if (indexIng > 0) {
        const temp = state.ingredients[indexIng];
        state.ingredients[indexIng] = state.ingredients[indexIng - 1];
        state.ingredients[indexIng - 1] = temp;
      }
      saveToLocalStorage(state);
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const indexIng = state.ingredients.findIndex(
        (ing) => ing.id === action.payload
      );

      if (indexIng < state.ingredients.length - 1 && indexIng !== -1) {
        const temp = state.ingredients[indexIng];
        state.ingredients[indexIng] = state.ingredients[indexIng + 1];
        state.ingredients[indexIng + 1] = temp;
      }
      saveToLocalStorage(state);
    }
  },
  selectors: {
    selectConstructorIngredients: (state) => state.ingredients,
    selectBun: (state) => state.bun,
    selectConstructorInfo: (state) => state,
    selectConstructorForIngredients: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  addConstructorIngredients,
  addBun,
  removeConstructorIngredient,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;
export const {
  selectConstructorIngredients,
  selectBun,
  selectConstructorInfo,
  selectConstructorForIngredients
} = burgerConstructorSlice.selectors;
