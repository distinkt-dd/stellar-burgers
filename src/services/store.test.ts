import { rootReducer, type RootState } from '@store';

describe('Тесты над root reducer', () => {
  it('Должен правильно инициализироваться', () => {
    const initialState: RootState = rootReducer(undefined, { type: '' });
    expect(initialState).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      password: expect.any(Object),
      order: expect.any(Object),
      'profile-orders': expect.any(Object),
      'burger-constructor': expect.any(Object),
      feeds: expect.any(Object)
    } as RootState);
  });
});
