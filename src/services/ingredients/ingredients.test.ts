import { getIngredients } from '@actions';
import { ingredientsSlice, ingredientsInitialState } from './slice';
import { TIngredient } from '@utils-types';

const { reducer } = ingredientsSlice;

describe('Тест слайса ingredients', () => {
  // Моковые данные для тестов
  const mockIngredients: TIngredient[] = [
    {
      _id: 'ing1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 100,
      price: 50,
      image: 'image1.jpg',
      image_large: 'image1-large.jpg',
      image_mobile: 'image1-mobile.jpg'
    },
    {
      _id: 'ing2',
      name: 'Ингредиент 2',
      type: 'sauce',
      proteins: 5,
      fat: 10,
      carbohydrates: 5,
      calories: 80,
      price: 30,
      image: 'image2.jpg',
      image_large: 'image2-large.jpg',
      image_mobile: 'image2-mobile.jpg'
    },
    {
      _id: 'bun1',
      name: 'Булка',
      type: 'bun',
      proteins: 20,
      fat: 10,
      carbohydrates: 30,
      calories: 200,
      price: 100,
      image: 'bun.jpg',
      image_large: 'bun-large.jpg',
      image_mobile: 'bun-mobile.jpg'
    }
  ];

  const mockIngredient: TIngredient = {
    _id: 'ing1',
    name: 'Ингредиент 1',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'image1.jpg',
    image_large: 'image1-large.jpg',
    image_mobile: 'image1-mobile.jpg'
  };

  describe('getIngredients', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = reducer(ingredientsInitialState, action);

      expect(state.isResponse).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toBeUndefined();
      expect(state.currentIngredient).toBeNull();
    });

    test('Проверка данных после успешного получения ингредиентов', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer(ingredientsInitialState, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(3);
      expect(state.isResponse).toBe(false);
      expect(state.error).toBeNull();
    });

    test('Проверка данных при ошибочном получении ингредиентов', () => {
      const errMessage = 'Failed to fetch ingredients';
      const action = {
        type: getIngredients.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(ingredientsInitialState, action);

      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);

      expect(state.ingredients).toBeUndefined();
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      expect(ingredientsInitialState.isResponse).toBe(false);
      expect(ingredientsInitialState.ingredients).toBeUndefined();

      const pendingAction = { type: getIngredients.pending.type };
      const pendingState = reducer(ingredientsInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      const fulfilledAction = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.ingredients).toEqual(mockIngredients);
      expect(fulfilledState.isResponse).toBe(false);
      expect(fulfilledState.error).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      const pendingAction = { type: getIngredients.pending.type };
      const pendingState = reducer(ingredientsInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      const errMessage = 'Network error';
      const rejectedAction = {
        type: getIngredients.rejected.type,
        error: { message: errMessage }
      };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.error).toBe(errMessage);
      expect(rejectedState.isResponse).toBe(false);
      expect(rejectedState.ingredients).toBeUndefined();
    });
  });

  describe('setCurrentIngredient', () => {
    test('Должен установить текущий ингредиент', () => {
      const action = {
        type: ingredientsSlice.actions.setCurrentIngredient.type,
        payload: mockIngredient
      };
      const state = reducer(ingredientsInitialState, action);

      expect(state.currentIngredient).toEqual(mockIngredient);
      expect(state.currentIngredient?._id).toBe('ing1');
      expect(state.currentIngredient?.name).toBe('Ингредиент 1');
    });

    test('Должен обновить существующий текущий ингредиент', () => {
      // Сначала устанавливаем первый ингредиент
      const firstAction = {
        type: ingredientsSlice.actions.setCurrentIngredient.type,
        payload: mockIngredient
      };
      const stateWithFirstIngredient = reducer(
        ingredientsInitialState,
        firstAction
      );
      expect(stateWithFirstIngredient.currentIngredient).toEqual(
        mockIngredient
      );

      // Обновляем на второй ингредиент
      const secondIngredient: TIngredient = {
        _id: 'ing2',
        name: 'Ингредиент 2',
        type: 'sauce',
        proteins: 5,
        fat: 10,
        carbohydrates: 5,
        calories: 80,
        price: 30,
        image: 'image2.jpg',
        image_large: 'image2-large.jpg',
        image_mobile: 'image2-mobile.jpg'
      };

      const secondAction = {
        type: ingredientsSlice.actions.setCurrentIngredient.type,
        payload: secondIngredient
      };
      const finalState = reducer(stateWithFirstIngredient, secondAction);

      expect(finalState.currentIngredient).toEqual(secondIngredient);
      expect(finalState.currentIngredient?._id).toBe('ing2');
    });
  });

  describe('deleteCurrentIngredient', () => {
    test('Должен удалить текущий ингредиент', () => {
      // Сначала устанавливаем ингредиент
      const setAction = {
        type: ingredientsSlice.actions.setCurrentIngredient.type,
        payload: mockIngredient
      };
      const stateWithIngredient = reducer(ingredientsInitialState, setAction);
      expect(stateWithIngredient.currentIngredient).toEqual(mockIngredient);

      // Удаляем текущий ингредиент
      const deleteAction = {
        type: ingredientsSlice.actions.deleteCurrentIngredient.type
      };
      const finalState = reducer(stateWithIngredient, deleteAction);

      expect(finalState.currentIngredient).toBeNull();
    });
  });

  describe('Тест селекторов', () => {
    // Состояние слайса
    const sliceState = {
      ingredients: mockIngredients,
      isResponse: false,
      currentIngredient: mockIngredient,
      error: null
    };

    // Глобальный state с полем ingredients
    const globalState = {
      ingredients: sliceState
    };

    test('selectIngredients должен возвращать список ингредиентов', () => {
      const ingredients =
        ingredientsSlice.selectors.selectIngredients(globalState);
      expect(ingredients).toEqual(mockIngredients);
      expect(ingredients).toHaveLength(3);
    });

    test('selectIngredientsError должен возвращать ошибку', () => {
      const errorState = {
        ingredients: {
          ...sliceState,
          error: 'Ошибка загрузки'
        }
      };
      const error =
        ingredientsSlice.selectors.selectIngredientsError(errorState);
      expect(error).toBe('Ошибка загрузки');
    });

    test('selectIngredientsIsResponse должен возвращать статус ответа', () => {
      const pendingState = {
        ingredients: {
          ...sliceState,
          isResponse: true
        }
      };
      const isResponse =
        ingredientsSlice.selectors.selectIngredientsIsResponse(pendingState);
      expect(isResponse).toBe(true);

      const notRespondingState = {
        ingredients: sliceState
      };
      const notResponding =
        ingredientsSlice.selectors.selectIngredientsIsResponse(
          notRespondingState
        );
      expect(notResponding).toBe(false);
    });

    test('selectCurrentIngredient должен возвращать текущий ингредиент', () => {
      const currentIngredient =
        ingredientsSlice.selectors.selectCurrentIngredient(globalState);
      expect(currentIngredient).toEqual(mockIngredient);
    });

    test('Селекторы должны возвращать корректные значения для начального состояния', () => {
      const emptyGlobalState = {
        ingredients: ingredientsInitialState
      };

      expect(
        ingredientsSlice.selectors.selectIngredients(emptyGlobalState)
      ).toBeUndefined();
      expect(
        ingredientsSlice.selectors.selectIngredientsError(emptyGlobalState)
      ).toBeNull();
      expect(
        ingredientsSlice.selectors.selectIngredientsIsResponse(emptyGlobalState)
      ).toBe(false);
      expect(
        ingredientsSlice.selectors.selectCurrentIngredient(emptyGlobalState)
      ).toBeNull();
    });
  });
});
