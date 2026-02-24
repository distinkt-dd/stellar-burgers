import { rootReducer, type RootState } from '@store';
import {
  initialState,
  passwordInitialState,
  orderInitialState,
  ordersInitialState,
  ingredientsInitialState,
  feedsInitialState,
  burgerConstructorInitialState
} from '@slices';

describe('Тесты над root reducer', () => {
  it('Должен правильно инициализироваться', () => {
    const initialStateReducer: RootState = rootReducer(undefined, { type: '' });
    expect(initialStateReducer.user).toEqual(initialState);
    expect(initialStateReducer.password).toEqual(passwordInitialState);
    expect(initialStateReducer.order).toEqual(orderInitialState);
    expect(initialStateReducer['profile-orders']).toEqual(ordersInitialState);
    expect(initialStateReducer.ingredients).toEqual(ingredientsInitialState);
    expect(initialStateReducer.feeds).toEqual(feedsInitialState);
    expect(initialStateReducer['burger-constructor']).toEqual(
      burgerConstructorInitialState
    );
  });
});
