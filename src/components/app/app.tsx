import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { checkUserAuth, getIngredients } from '@actions';
import { AppHeader, IngredientDetails, Modal } from '@components';
import { useDispatch } from '@store';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { deleteCurrentIngredient } from '@slices';
import { utilsFunctions } from '@utils-functions';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredients());
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<ConstructorPage />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title=''
                onClose={() =>
                  utilsFunctions.onCloseModal(
                    dispatch,
                    deleteCurrentIngredient,
                    navigate,
                    -1
                  )
                }
              >
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
