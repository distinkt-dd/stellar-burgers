import { getProfileOrders } from '@actions';
import { ordersSlice, ordersInitialState } from './slice';
import { TOrder } from '@utils-types';

const { reducer } = ordersSlice;

describe('Тест слайса profile-orders', () => {
  // Моковые данные для тестов
  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      ingredients: ['ing1', 'ing2', 'bun1'],
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z',
      number: 12345
    },
    {
      _id: 'order2',
      ingredients: ['ing3', 'ing4', 'bun2'],
      status: 'pending',
      name: 'Бургер 2',
      createdAt: '2024-01-02T12:00:00Z',
      updatedAt: '2024-01-02T12:00:00Z',
      number: 12346
    },
    {
      _id: 'order3',
      ingredients: ['ing5', 'ing6', 'bun3'],
      status: 'done',
      name: 'Бургер 3',
      createdAt: '2024-01-03T12:00:00Z',
      updatedAt: '2024-01-03T12:00:00Z',
      number: 12347
    }
  ];

  describe('getProfileOrders', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: getProfileOrders.pending.type };
      const state = reducer(ordersInitialState, action);

      expect(state.isResponse).toBe(true);
      expect(state.orders).toEqual([]);
      expect(state.currentOrder).toBeNull();
    });

    test('Проверка данных после успешного получения заказов', () => {
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer(ordersInitialState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.orders).toHaveLength(3);
      expect(state.isResponse).toBe(false);
      expect(state.currentOrder).toBeNull();
    });

    test('Проверка данных при ошибочном получении заказов', () => {
      const action = {
        type: getProfileOrders.rejected.type
      };
      const state = reducer(ordersInitialState, action);

      expect(state.isResponse).toBe(false);

      expect(state.orders).toEqual([]);
      expect(state.currentOrder).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      expect(ordersInitialState.isResponse).toBe(false);
      expect(ordersInitialState.orders).toEqual([]);

      const pendingAction = { type: getProfileOrders.pending.type };
      const pendingState = reducer(ordersInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.orders).toEqual([]);

      const fulfilledAction = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.orders).toEqual(mockOrders);
      expect(fulfilledState.orders).toHaveLength(3);
      expect(fulfilledState.isResponse).toBe(false);
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      const pendingAction = { type: getProfileOrders.pending.type };
      const pendingState = reducer(ordersInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.orders).toEqual([]);

      const rejectedAction = { type: getProfileOrders.rejected.type };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.isResponse).toBe(false);
      expect(rejectedState.orders).toEqual([]);
    });

    test('Должен обработать пустой массив заказов', () => {
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: []
      };
      const state = reducer(ordersInitialState, action);

      expect(state.orders).toEqual([]);
      expect(state.isResponse).toBe(false);
    });

    test('Должен обновить существующие заказы новыми', () => {
      const firstAction = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrders.slice(0, 2)
      };
      const stateWithOrders = reducer(ordersInitialState, firstAction);
      expect(stateWithOrders.orders).toHaveLength(2);

      const secondAction = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const finalState = reducer(stateWithOrders, secondAction);
      expect(finalState.orders).toHaveLength(3);
      expect(finalState.orders).toEqual(mockOrders);
    });
  });

  describe('Тест селекторов', () => {
    // Состояние слайса
    const sliceState = {
      orders: mockOrders,
      isResponse: false,
      currentOrder: null
    };

    const globalState = {
      'profile-orders': sliceState
    };

    test('selectProfileOrders должен возвращать список заказов', () => {
      const orders = ordersSlice.selectors.selectProfileOrders(globalState);
      expect(orders).toEqual(mockOrders);
      expect(orders).toHaveLength(3);
    });

    test('selectProfileOrdersIsResponse должен возвращать статус ответа', () => {
      const pendingState = {
        'profile-orders': {
          ...sliceState,
          isResponse: true
        }
      };
      const isResponse =
        ordersSlice.selectors.selectProfileOrdersIsResponse(pendingState);
      expect(isResponse).toBe(true);

      const notRespondingState = {
        'profile-orders': sliceState
      };
      const notResponding =
        ordersSlice.selectors.selectProfileOrdersIsResponse(notRespondingState);
      expect(notResponding).toBe(false);
    });

    test('selectProfileCurrentOrder должен возвращать текущий заказ', () => {
      const stateWithCurrentOrder = {
        'profile-orders': {
          ...sliceState,
          currentOrder: mockOrders[0]
        }
      };
      const currentOrder = ordersSlice.selectors.selectProfileCurrentOrder(
        stateWithCurrentOrder
      );
      expect(currentOrder).toEqual(mockOrders[0]);
      expect(currentOrder?.number).toBe(12345);
    });

    test('Селекторы должны возвращать корректные значения для начального состояния', () => {
      const emptyGlobalState = {
        'profile-orders': ordersInitialState
      };

      expect(
        ordersSlice.selectors.selectProfileOrders(emptyGlobalState)
      ).toEqual([]);
      expect(
        ordersSlice.selectors.selectProfileOrdersIsResponse(emptyGlobalState)
      ).toBe(false);
      expect(
        ordersSlice.selectors.selectProfileCurrentOrder(emptyGlobalState)
      ).toBeNull();
    });
  });
});
