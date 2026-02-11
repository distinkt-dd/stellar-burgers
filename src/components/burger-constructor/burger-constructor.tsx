import { sendOrder } from '@actions';
import {
  clearOrderModalData,
  selectBun,
  selectConstructorInfo,
  selectNewOrder,
  selectNewOrderRequest
} from '@slices';
import { useDispatch, useSelector } from '@store';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorInfo);

  const orderRequest = useSelector(selectNewOrderRequest);

  const orderModalData = useSelector(selectNewOrder);
  const bun = useSelector(selectBun);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onOrderClick = () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const ingredientsIds = constructorItems.ingredients.map((item) => item._id);
    if (bun) {
      ingredientsIds.unshift(bun._id);
      ingredientsIds.push(bun._id);
    }
    dispatch(sendOrder(ingredientsIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
