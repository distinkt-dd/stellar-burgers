import { TInitialStateBurgerConstructor } from '@slices';
import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TInitialStateBurgerConstructor;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
