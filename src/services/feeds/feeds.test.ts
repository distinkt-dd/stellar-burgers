import { feedsGetAll } from '@actions';
import { feedsSlice, feedsInitialState } from './slice';
import { TOrder } from '@utils-types';

const { reducer } = feedsSlice;

describe('Тест слайса feeds', () => {
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
    }
  ];

  const mockFeedResponse = {
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  const mockOrder: TOrder = {
    _id: 'order1',
    ingredients: ['ing1', 'ing2', 'bun1'],
    status: 'done',
    name: 'Бургер 1',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    number: 12345
  };

  describe('feedsGetAll', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: feedsGetAll.pending.type };
      const state = reducer(feedsInitialState, action);

      expect(state.orders).toEqual([]);
      expect(state.error).toBeNull();
      // Проверяем, что feed не изменился
      expect(state.feed.total).toBeNull();
      expect(state.feed.totalToday).toBeNull();
    });

    test('Проверка данных после успешного получения ленты', () => {
      const action = {
        type: feedsGetAll.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = reducer(feedsInitialState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.orders).toHaveLength(2);
      expect(state.feed.total).toBe(100);
      expect(state.feed.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });

    test('Проверка данных при ошибочном получении ленты', () => {
      const errMessage = 'Failed to fetch feeds';
      const action = {
        type: feedsGetAll.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(feedsInitialState, action);

      expect(state.error).toBe(errMessage);
      expect(state.orders).toEqual([]);
      expect(state.feed.total).toBeNull();
      expect(state.feed.totalToday).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      // Начальное состояние
      expect(feedsInitialState.orders).toEqual([]);
      expect(feedsInitialState.feed.total).toBeNull();

      // pending
      const pendingAction = { type: feedsGetAll.pending.type };
      const pendingState = reducer(feedsInitialState, pendingAction);
      expect(pendingState.orders).toEqual([]);
      expect(pendingState.error).toBeNull();

      // fulfilled
      const fulfilledAction = {
        type: feedsGetAll.fulfilled.type,
        payload: mockFeedResponse
      };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.orders).toEqual(mockOrders);
      expect(fulfilledState.feed.total).toBe(100);
      expect(fulfilledState.feed.totalToday).toBe(10);
      expect(fulfilledState.error).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      const pendingAction = { type: feedsGetAll.pending.type };
      const pendingState = reducer(feedsInitialState, pendingAction);
      expect(pendingState.orders).toEqual([]);
      expect(pendingState.error).toBeNull();

      const errMessage = 'Network error';
      const rejectedAction = {
        type: feedsGetAll.rejected.type,
        error: { message: errMessage }
      };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.error).toBe(errMessage);
      expect(rejectedState.orders).toEqual([]);
      expect(rejectedState.feed.total).toBeNull();
    });
  });

  describe('setCurrentOrder', () => {
    test('Должен установить текущий заказ', () => {
      const action = {
        type: feedsSlice.actions.setCurrentOrder.type,
        payload: mockOrder
      };
      const state = reducer(feedsInitialState, action);

      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.currentOrder?._id).toBe('order1');
      expect(state.currentOrder?.number).toBe(12345);
    });

    test('Должен обновить существующий текущий заказ', () => {
      const firstAction = {
        type: feedsSlice.actions.setCurrentOrder.type,
        payload: mockOrder
      };
      const stateWithFirstOrder = reducer(feedsInitialState, firstAction);
      expect(stateWithFirstOrder.currentOrder).toEqual(mockOrder);

      const secondOrder: TOrder = {
        _id: 'order2',
        ingredients: ['ing3', 'ing4', 'bun2'],
        status: 'pending',
        name: 'Бургер 2',
        createdAt: '2024-01-02T12:00:00Z',
        updatedAt: '2024-01-02T12:00:00Z',
        number: 12346
      };

      const secondAction = {
        type: feedsSlice.actions.setCurrentOrder.type,
        payload: secondOrder
      };
      const finalState = reducer(stateWithFirstOrder, secondAction);

      expect(finalState.currentOrder).toEqual(secondOrder);
      expect(finalState.currentOrder?.number).toBe(12346);
    });
  });

  describe('Тест селекторов', () => {
    const sliceState = {
      orders: mockOrders,
      feed: {
        total: 100,
        totalToday: 10
      },
      error: null,
      currentOrder: mockOrder
    };

    const globalState = {
      feeds: sliceState
    };

    test('getFeedsOrders должен возвращать список заказов', () => {
      const orders = feedsSlice.selectors.getFeedsOrders(globalState);
      expect(orders).toEqual(mockOrders);
      expect(orders).toHaveLength(2);
    });

    test('getFeedsTotal должен возвращать общее количество', () => {
      const total = feedsSlice.selectors.getFeedsTotal(globalState);
      expect(total).toBe(100);
    });

    test('getFeedsTotalToday должен возвращать количество за сегодня', () => {
      const totalToday = feedsSlice.selectors.getFeedsTotalToday(globalState);
      expect(totalToday).toBe(10);
    });

    test('getFeed должен возвращать объект feed', () => {
      const feed = feedsSlice.selectors.getFeed(globalState);
      expect(feed).toEqual({ total: 100, totalToday: 10 });
    });

    test('getCurrentOrder должен возвращать текущий заказ', () => {
      const currentOrder = feedsSlice.selectors.getCurrentOrder(globalState);
      expect(currentOrder).toEqual(mockOrder);
    });

    test('Селекторы должны возвращать корректные значения для начального состояния', () => {
      const emptyGlobalState = {
        feeds: feedsInitialState
      };

      expect(feedsSlice.selectors.getFeedsOrders(emptyGlobalState)).toEqual([]);
      expect(feedsSlice.selectors.getFeedsTotal(emptyGlobalState)).toBeNull();
      expect(
        feedsSlice.selectors.getFeedsTotalToday(emptyGlobalState)
      ).toBeNull();
      expect(feedsSlice.selectors.getFeed(emptyGlobalState)).toEqual({
        total: null,
        totalToday: null
      });
      expect(feedsSlice.selectors.getCurrentOrder(emptyGlobalState)).toBeNull();
    });
  });
});
