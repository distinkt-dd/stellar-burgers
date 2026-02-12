import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '@store';
import {
  selectCurrentIngredient,
  selectIngredients,
  setCurrentIngredient
} from '@slices';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  let ingredientData = useSelector(selectCurrentIngredient);
  const { id } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredientData || ingredientData._id !== id) {
      if (ingredients) {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) {
          dispatch(setCurrentIngredient(ingredient));
        }
      }
    }
  }, [id, ingredients, ingredientData]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
