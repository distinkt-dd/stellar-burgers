import { sendOrder } from '@actions';
import { orderSlice, orderInitialState, clearOrderModalData } from './slice';
import { TOrder } from '@utils-types';

const { reducer } = orderSlice;

describe('Тест слайса order', () => {
  // Моковые данные для тестов
  const mockOrder: TOrder = {
    _id: 'order123',
    ingredients: ['ing1', 'ing2', 'bun1', 'ing3'],
    status: 'done',
    name: 'Супер бургер',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    number: 12345
  };

  const mockOrderResponse = {
    order: mockOrder,
    name: 'Супер бургер'
  };

  describe('sendOrder', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: sendOrder.pending.type };
      const state = reducer(orderInitialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.order).toBeNull();
      expect(state.name).toBeNull();
    });

    test('Проверка данных после успешной отправки заказа', () => {
      const action = {
        type: sendOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const state = reducer(orderInitialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.name).toBe('Супер бургер');
      expect(state.order?.number).toBe(12345);
    });

    test('Проверка данных при ошибочной отправке заказа', () => {
      const action = { type: sendOrder.rejected.type };
      const state = reducer(orderInitialState, action);

      expect(state.orderRequest).toBe(false);

      expect(state.order).toBeNull();
      expect(state.name).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      expect(orderInitialState.orderRequest).toBe(false);
      expect(orderInitialState.order).toBeNull();

      const pendingAction = { type: sendOrder.pending.type };
      const pendingState = reducer(orderInitialState, pendingAction);
      expect(pendingState.orderRequest).toBe(true);
      expect(pendingState.order).toBeNull();

      const fulfilledAction = {
        type: sendOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.orderRequest).toBe(false);
      expect(fulfilledState.order).toEqual(mockOrder);
      expect(fulfilledState.name).toBe('Супер бургер');
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      const pendingAction = { type: sendOrder.pending.type };
      const pendingState = reducer(orderInitialState, pendingAction);
      expect(pendingState.orderRequest).toBe(true);
      expect(pendingState.order).toBeNull();

      const rejectedAction = { type: sendOrder.rejected.type };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.orderRequest).toBe(false);
      expect(rejectedState.order).toBeNull();
      expect(rejectedState.name).toBeNull();
    });

    test('Должен обновить существующий заказ новым', () => {
      const firstAction = {
        type: sendOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const stateWithOrder = reducer(orderInitialState, firstAction);
      expect(stateWithOrder.order?.number).toBe(12345);

      const secondOrder: TOrder = {
        ...mockOrder,
        _id: 'order456',
        number: 12346,
        name: 'Другой бургер'
      };
      const secondAction = {
        type: sendOrder.fulfilled.type,
        payload: {
          order: secondOrder,
          name: 'Другой бургер'
        }
      };
      const finalState = reducer(stateWithOrder, secondAction);
      expect(finalState.order?.number).toBe(12346);
      expect(finalState.name).toBe('Другой бургер');
    });
  });

  describe('clearOrderModalData', () => {
    test('Должен очистить данные заказа', () => {
      // Сначала отправляем заказ
      const sendAction = {
        type: sendOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const stateWithOrder = reducer(orderInitialState, sendAction);
      expect(stateWithOrder.order).toEqual(mockOrder);
      expect(stateWithOrder.name).toBe('Супер бургер');

      // Очищаем данные
      const clearAction = { type: clearOrderModalData.type };
      const clearedState = reducer(stateWithOrder, clearAction);

      expect(clearedState.orderRequest).toBe(false);
      expect(clearedState.order).toBeNull();
      expect(clearedState.name).toBeNull();
    });

    test('Должен корректно обрабатывать очистку, когда заказа нет', () => {
      expect(orderInitialState.order).toBeNull();

      const clearAction = { type: clearOrderModalData.type };
      const state = reducer(orderInitialState, clearAction);

      expect(state.orderRequest).toBe(false);
      expect(state.order).toBeNull();
      expect(state.name).toBeNull();
    });

    test('Должен сбрасывать orderRequest в false', () => {
      const pendingAction = { type: sendOrder.pending.type };
      const pendingState = reducer(orderInitialState, pendingAction);
      expect(pendingState.orderRequest).toBe(true);

      const clearAction = { type: clearOrderModalData.type };
      const clearedState = reducer(pendingState, clearAction);

      expect(clearedState.orderRequest).toBe(false);
      expect(clearedState.order).toBeNull();
    });
  });

  describe('Тест селекторов', () => {
    // Состояние слайса
    const sliceState = {
      orderRequest: false,
      order: mockOrder,
      name: 'Супер бургер'
    };
    const globalState = {
      order: sliceState
    };

    test('selectNewOrder должен возвращать заказ', () => {
      const order = orderSlice.selectors.selectNewOrder(globalState);
      expect(order).toEqual(mockOrder);
      expect(order?.number).toBe(12345);
    });

    test('selectNewOrderRequest должен возвращать статус запроса', () => {
      const pendingState = {
        order: {
          ...sliceState,
          orderRequest: true
        }
      };
      const orderRequest =
        orderSlice.selectors.selectNewOrderRequest(pendingState);
      expect(orderRequest).toBe(true);

      const notRequestingState = {
        order: sliceState
      };
      const notRequesting =
        orderSlice.selectors.selectNewOrderRequest(notRequestingState);
      expect(notRequesting).toBe(false);
    });

    test('selectNewOrderName должен возвращать имя заказа', () => {
      const name = orderSlice.selectors.selectNewOrderName(globalState);
      expect(name).toBe('Супер бургер');
    });
  });
});
