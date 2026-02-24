import { userSlice, initialState } from './slice';

import { login, logout, register, update } from './actions';

import { TUser } from '@utils-types';
import { TAuthResponse } from '@api';
const { reducer } = userSlice;

describe('Тест slice пользователя', () => {
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  const mockApiResponse: TAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'testToken',
    refreshToken: 'testRefreshToken'
  };

  describe('registerUser', () => {
    test('Проверка isResponse и error во время регистрации', () => {
      const action = { type: register.pending.type };
      const state = reducer(initialState, action);
      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });

    test('Проверка данных после регистрации', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockApiResponse
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isResponse).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('');
    });

    test('Проверка данных при ошибочной регистрации', () => {
      const errMessage = 'User already exists';
      const action = {
        type: register.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    test('Проверка isResponse и error во время авторизации', () => {
      const action = { type: login.pending.type };
      const state = reducer(initialState, action);
      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });
    test('Проверка данных после авторизации', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockApiResponse
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isResponse).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('');
    });
    test('Проверка данных при ошибочной авторизации', () => {
      const errMessage = 'email or password are incorrect';
      const action = {
        type: login.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('logoutUser', () => {
    test('Проверка isResponse во время выхода', () => {
      const action = { type: logout.pending.type };
      const state = reducer(initialState, action);
      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });

    test('Проверка данных после успешного выхода', () => {
      const loginState = reducer(initialState, {
        type: login.fulfilled.type,
        payload: mockApiResponse
      });
      expect(loginState.user).toEqual(mockUser);

      const action = { type: logout.fulfilled.type };
      const state = reducer(loginState, action);
      expect(state.user).toBeNull();
      expect(state.isResponse).toBe(false);
      expect(state.error).toBe('');
    });

    test('Проверка данных при ошибочном выходе', () => {
      const errMessage = 'Failed to logout';
      const action = {
        type: logout.rejected.type,
        error: { message: errMessage }
      };
      const state = reducer(initialState, action);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
    });
  });

  describe('updateUser', () => {
    const updatedUser: TUser = {
      email: 'updated@test.com',
      name: 'Updated User'
    };

    const mockUpdateResponse: TAuthResponse = {
      success: true,
      user: updatedUser,
      accessToken: 'newToken',
      refreshToken: 'newRefreshToken'
    };

    test('Проверка isResponse и error во время обновления', () => {
      const action = { type: update.pending.type };
      const state = reducer(initialState, action);
      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });

    test('Проверка данных после успешного обновления', () => {
      const loginState = reducer(initialState, {
        type: login.fulfilled.type,
        payload: mockApiResponse
      });
      expect(loginState.user).toEqual(mockUser);

      const action = {
        type: update.fulfilled.type,
        payload: mockUpdateResponse
      };
      const state = reducer(loginState, action);
      expect(state.user).toEqual(updatedUser);
      expect(state.isResponse).toBe(false);
      expect(state.error).toBe('');
    });

    test('Проверка данных при ошибочном обновлении', () => {
      const errMessage = 'Failed to update user';
      const action = {
        type: update.rejected.type,
        error: { message: errMessage }
      };

      const loginState = reducer(initialState, {
        type: login.fulfilled.type,
        payload: mockApiResponse
      });

      const state = reducer(loginState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBe(errMessage);
      expect(state.isResponse).toBe(false);
    });
  });
});
