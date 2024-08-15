import { Router, Request, Response } from 'express';
import { IngredientRequest } from '../models/Ingredient';
import ingredientsService from '../services/IngredientsService';

const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req: Request, res: Response) => {
  const {url} = req.body as IngredientRequest;
  if (url) {
    const ingredients = await ingredientsService.fetchIngredients(url);
    res.header("Access-Control-Allow-Origin", "*")
    return res.json(ingredients);
  } else {
    res.status(400).send({error:'Bad request: missing URL.'})
  }
});

export default ingredientsRouter;