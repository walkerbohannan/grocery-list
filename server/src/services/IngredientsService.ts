import {IIngredient, IngredientsResponse} from '@src/models/Ingredient';

async function fetchIngredients(url: string): Promise<IngredientsResponse> {
  const ingredientsResponse =
      {
        ingredients: [
          {
            quantity: 1,
            measurement: 'cup',
            ingredient: 'rice',
          } as IIngredient,
        ],
        url,
        title: 'Just rice',
      } as IngredientsResponse;
  return Promise.resolve(ingredientsResponse);
}

export default {
  fetchIngredients,
} as const;
