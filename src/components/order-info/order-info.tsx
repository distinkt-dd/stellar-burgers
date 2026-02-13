import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import {
  getCurrentOrder,
  getFeedsOrders,
  selectIngredients,
  selectProfileOrders,
  setCurrentOrder
} from '@slices';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from '@store';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(getCurrentOrder);
  const feedOrders = useSelector(getFeedsOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const { number } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const isFeedPage = location.pathname.includes('/feed/');
  const isProfilePage = location.pathname.includes('/profile/orders/');
  const ingredients: TIngredient[] = useSelector(selectIngredients) || [];

  useEffect(() => {
    const orderNumber = Number(number);
    if (isFeedPage && feedOrders.length > 0) {
      const foundOrder = feedOrders.find(
        (order) => order?.number === orderNumber
      );
      if (foundOrder) {
        dispatch(setCurrentOrder(foundOrder));
        return;
      }
    }
    if (isProfilePage && profileOrders.length > 0) {
      const foundOrder = profileOrders.find(
        (order) => order?.number === orderNumber
      );
      if (foundOrder) {
        dispatch(setCurrentOrder(foundOrder));
        return;
      }
    }
  }, [number, feedOrders, profileOrders, orderData, dispatch]);
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
