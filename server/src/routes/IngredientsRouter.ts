import { Router } from 'express';
import { IngredientRequest } from '@src/models/Ingredient';
import ingredientsService from '@src/services/IngredientsService';


const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  const {url} = req.body as IngredientRequest;
  const ingredients = await ingredientsService.fetchIngredients(url);

  return res.json(ingredients);
});

export default ingredientsRouter;