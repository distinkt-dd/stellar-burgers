import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { checkUserAuth, getIngredients } from '@actions';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '@store';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { clearCurrentOrder, deleteCurrentIngredient } from '@slices';
import { utilsFunctions } from '@utils-functions';
import { ProtectedRoute } from '@protected-route';

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
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
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
          <Route
            path='/feed/:number'
            element={
              <Modal
                title=''
                onClose={() =>
                  utilsFunctions.onCloseModal(
                    dispatch,
                    clearCurrentOrder,
                    navigate,
                    -1
                  )
                }
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
