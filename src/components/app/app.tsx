import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Preloader } from '@ui';

const App = () => {
  useEffect(() => {}, []);
  const isLoading = false;
  const error = false;
  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
