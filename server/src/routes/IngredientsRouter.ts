import { Router, Request, Response } from 'express';
import { IngredientRequest } from '../models/Ingredient';
import ingredientsService from '../services/IngredientsService';


const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req: Request, res: Response) => {
  const {url} = req.body as IngredientRequest;
  const ingredients = await ingredientsService.fetchIngredients(url);

  return res.json(ingredients);
});

export default ingredientsRouter;