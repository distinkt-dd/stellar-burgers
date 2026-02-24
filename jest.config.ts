module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // Соответствует алиасам из webpack
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@store$': '<rootDir>/src/services/store.ts',
    '^@actions$': '<rootDir>/src/services/actions.index.ts',
    '^@slices$': '<rootDir>/src/services/slices.index.ts',
    '^@protected-route$': '<rootDir>/src/components/protected-route',
    '^@utils-functions$': '<rootDir>/src/utils/functions.ts',
    // Для стилей и ассетов
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
