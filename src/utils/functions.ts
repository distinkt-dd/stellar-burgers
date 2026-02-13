import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { AppDispatch } from '@store';
import { NavigateFunction } from 'react-router-dom';

export const onCloseModal = (
  dispatch: AppDispatch,
  actionCreator: ActionCreatorWithoutPayload<string>,
  navigate: NavigateFunction,
  to: string | number
) => {
  dispatch(actionCreator());
  if (typeof to === 'number') {
    navigate(to);
  } else {
    navigate(to);
  }
};

export const utilsFunctions = {
  onCloseModal
};
