import { forgot, reset } from '@actions';
import { passwordSlice, passwordInitialState } from './slice';

const { reducer } = passwordSlice;

describe('Тест слайса password', () => {
  describe('forgotPassword', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: forgot.pending.type };
      const state = reducer(passwordInitialState, action);

      expect(state.isResponse).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Проверка данных после успешного запроса на восстановление', () => {
      const action = { type: forgot.fulfilled.type };
      const state = reducer(passwordInitialState, action);

      expect(state.isResponse).toBe(false);
      expect(state.error).toBeNull();
    });

    test('Проверка данных при ошибочном запросе на восстановление', () => {
      const errMessage = 'User not found';
      const action = {
        type: forgot.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(passwordInitialState, action);

      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      expect(passwordInitialState.isResponse).toBe(false);
      expect(passwordInitialState.error).toBeNull();

      const pendingAction = { type: forgot.pending.type };
      const pendingState = reducer(passwordInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      const fulfilledAction = { type: forgot.fulfilled.type };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.isResponse).toBe(false);
      expect(fulfilledState.error).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      const pendingAction = { type: forgot.pending.type };
      const pendingState = reducer(passwordInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      const errMessage = 'Network error';
      const rejectedAction = {
        type: forgot.rejected.type,
        error: { message: errMessage }
      };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.error).toBe(errMessage);
      expect(rejectedState.isResponse).toBe(false);
    });
  });

  describe('resetPassword', () => {
    test('Проверка состояния при pending', () => {
      const action = { type: reset.pending.type };
      const state = reducer(passwordInitialState, action);

      expect(state.isResponse).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Проверка данных после успешного сброса пароля', () => {
      const action = { type: reset.fulfilled.type };
      const state = reducer(passwordInitialState, action);

      expect(state.isResponse).toBe(false);
      expect(state.error).toBeNull();
    });

    test('Проверка данных при ошибочном сбросе пароля', () => {
      const errMessage = 'Invalid token';
      const action = {
        type: reset.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(passwordInitialState, action);

      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
    });

    test('Проверка последовательности состояний (pending -> fulfilled)', () => {
      // pending
      const pendingAction = { type: reset.pending.type };
      const pendingState = reducer(passwordInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      // fulfilled
      const fulfilledAction = { type: reset.fulfilled.type };
      const fulfilledState = reducer(pendingState, fulfilledAction);
      expect(fulfilledState.isResponse).toBe(false);
      expect(fulfilledState.error).toBeNull();
    });

    test('Проверка последовательности состояний (pending -> rejected)', () => {
      // pending
      const pendingAction = { type: reset.pending.type };
      const pendingState = reducer(passwordInitialState, pendingAction);
      expect(pendingState.isResponse).toBe(true);
      expect(pendingState.error).toBeNull();

      // rejected
      const errMessage = 'Network error';
      const rejectedAction = {
        type: reset.rejected.type,
        error: { message: errMessage }
      };
      const rejectedState = reducer(pendingState, rejectedAction);
      expect(rejectedState.error).toBe(errMessage);
      expect(rejectedState.isResponse).toBe(false);
    });
  });

  describe('Тест селекторов', () => {
    const sliceState = {
      error: 'Ошибка восстановления пароля',
      isResponse: true
    };

    const globalState = {
      password: sliceState
    };

    test('selectPasswordError должен возвращать ошибку', () => {
      const error = passwordSlice.selectors.selectPasswordError(globalState);
      expect(error).toBe('Ошибка восстановления пароля');
    });

    test('selectIsResponse должен возвращать статус ответа', () => {
      const isResponse = passwordSlice.selectors.selectIsResponse(globalState);
      expect(isResponse).toBe(true);
    });

    test('Селекторы должны возвращать корректные значения для начального состояния', () => {
      const emptyGlobalState = {
        password: passwordInitialState
      };

      expect(
        passwordSlice.selectors.selectPasswordError(emptyGlobalState)
      ).toBeNull();
      expect(passwordSlice.selectors.selectIsResponse(emptyGlobalState)).toBe(
        false
      );
    });
  });
});
