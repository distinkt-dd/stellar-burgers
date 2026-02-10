import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { checkUserAuth } from '@actions';
import { AppHeader } from '@components';
import { useDispatch } from '@store';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUserAuth());
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>
    </div>
  );
};

export default App;
