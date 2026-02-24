import {
  burgerConstructorSlice,
  addConstructorIngredients,
  addBun,
  removeConstructorIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './slice';

import { TConstructorIngredient } from '@utils-types';

// Тип для состояния слайса
type BurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Тест слайса burgerConstructor', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  const { reducer } = burgerConstructorSlice;

  const getInitialState = (): BurgerConstructorState => ({
    bun: null,
    ingredients: []
  });

  // Моковые данные для тестов
  const mockBun: TConstructorIngredient = {
    _id: 'bun1',
    id: 'unique-bun-1',
    name: 'Булка 1',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  const mockIngredient1: TConstructorIngredient = {
    _id: 'ing1',
    id: 'unique-ing-1',
    name: 'Ингредиент 1',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'image1.jpg',
    image_large: 'image1-large.jpg',
    image_mobile: 'image1-mobile.jpg'
  };

  const mockIngredient2: TConstructorIngredient = {
    _id: 'ing2',
    id: 'unique-ing-2',
    name: 'Ингредиент 2',
    type: 'sauce',
    proteins: 3,
    fat: 3,
    carbohydrates: 3,
    calories: 30,
    price: 30,
    image: 'image2.jpg',
    image_large: 'image2-large.jpg',
    image_mobile: 'image2-mobile.jpg'
  };

  describe('Тест экшена добавления ингредиента', () => {
    test('Должен добавить булку', () => {
      const state = reducer(getInitialState(), addBun(mockBun));

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(0);

      const savedData = JSON.parse(localStorage.getItem('burgerConstructor')!);
      expect(savedData.bun).toEqual(mockBun);
      expect(savedData.ingredients).toHaveLength(0);
    });

    test('Должен добавить ингредиент в начинку', () => {
      const state = reducer(
        getInitialState(),
        addConstructorIngredients(mockIngredient1)
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient1);

      const savedData = JSON.parse(localStorage.getItem('burgerConstructor')!);
      expect(savedData.bun).toBeNull();
      expect(savedData.ingredients).toHaveLength(1);
      expect(savedData.ingredients[0]).toEqual(mockIngredient1);
    });

    test('Должен добавить несколько ингредиентов в начинку', () => {
      let state = reducer(
        getInitialState(),
        addConstructorIngredients(mockIngredient1)
      );
      state = reducer(state, addConstructorIngredients(mockIngredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
      expect(state.ingredients[1]).toEqual(mockIngredient2);
    });
  });

  describe('Тест экшена удаления ингредиента', () => {
    test('Должен удалить ингредиент из начинки по id', () => {
      let state = reducer(
        getInitialState(),
        addConstructorIngredients(mockIngredient1)
      );
      state = reducer(state, addConstructorIngredients(mockIngredient2));
      expect(state.ingredients).toHaveLength(2);

      state = reducer(state, removeConstructorIngredient(mockIngredient1.id));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient2);

      const savedData = JSON.parse(localStorage.getItem('burgerConstructor')!);
      expect(savedData.ingredients).toHaveLength(1);
      expect(savedData.ingredients[0].id).toBe(mockIngredient2.id);
    });

    test('Не должен ничего удалить, если ингредиент с таким id не найден', () => {
      let state = reducer(
        getInitialState(),
        addConstructorIngredients(mockIngredient1)
      );
      expect(state.ingredients).toHaveLength(1);

      state = reducer(state, removeConstructorIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
    });
  });

  describe('Тест экшена изменения порядка ингредиентов', () => {
    let stateWithIngredients: BurgerConstructorState;

    beforeEach(() => {
      let state = reducer(
        getInitialState(),
        addConstructorIngredients(mockIngredient1)
      );
      state = reducer(state, addConstructorIngredients(mockIngredient2));

      const mockIngredient3: TConstructorIngredient = {
        ...mockIngredient1,
        _id: 'ing3',
        id: 'unique-ing-3',
        name: 'Ингредиент 3'
      };

      state = reducer(state, addConstructorIngredients(mockIngredient3));
      stateWithIngredients = state;
    });

    test('Должен переместить ингредиент вверх', () => {
      expect(stateWithIngredients.ingredients[0].id).toBe(mockIngredient1.id);
      expect(stateWithIngredients.ingredients[1].id).toBe(mockIngredient2.id);

      const newState = reducer(
        stateWithIngredients,
        moveIngredientUp(mockIngredient2.id)
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe(mockIngredient2.id);
      expect(newState.ingredients[1].id).toBe(mockIngredient1.id);

      const savedData = JSON.parse(localStorage.getItem('burgerConstructor')!);
      expect(savedData.ingredients[0].id).toBe(mockIngredient2.id);
    });

    test('Не должен переместить первый ингредиент вверх', () => {
      const newState = reducer(
        stateWithIngredients,
        moveIngredientUp(mockIngredient1.id)
      );

      expect(newState.ingredients[0].id).toBe(mockIngredient1.id);
      expect(newState.ingredients[1].id).toBe(mockIngredient2.id);
    });

    test('Должен переместить ингредиент вниз', () => {
      expect(stateWithIngredients.ingredients[0].id).toBe(mockIngredient1.id);
      expect(stateWithIngredients.ingredients[1].id).toBe(mockIngredient2.id);

      const newState = reducer(
        stateWithIngredients,
        moveIngredientDown(mockIngredient1.id)
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe(mockIngredient2.id);
      expect(newState.ingredients[1].id).toBe(mockIngredient1.id);

      const savedData = JSON.parse(localStorage.getItem('burgerConstructor')!);
      expect(savedData.ingredients[0].id).toBe(mockIngredient2.id);
    });

    test('Не должен переместить последний ингредиент вниз', () => {
      const lastIngredientId = stateWithIngredients.ingredients[2].id;

      const newState = reducer(
        stateWithIngredients,
        moveIngredientDown(lastIngredientId)
      );

      expect(newState.ingredients[2].id).toBe(lastIngredientId);
    });

    test('Не должен переместить несуществующий ингредиент', () => {
      const originalIngredients = [...stateWithIngredients.ingredients];

      const newState = reducer(
        stateWithIngredients,
        moveIngredientUp('non-existent-id')
      );

      expect(newState.ingredients).toEqual(originalIngredients);
    });
  });
});
