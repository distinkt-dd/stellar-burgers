import { getProfileOrders } from '@actions';
import { selectProfileOrders, selectProfileOrdersIsResponse } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */

  const orders: TOrder[] = useSelector(selectProfileOrders) || [];
  const ordersIsResponse = useSelector(selectProfileOrdersIsResponse);

  if (ordersIsResponse) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
