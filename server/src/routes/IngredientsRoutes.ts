import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import IngredientsService from '@src/services/IngredientsService';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //

/**
 * Get ingredients from a website
 */
async function fetchIngredients(req: IReq<{url: string}>, res: IRes) {
  const { url } = req.body;
  const ingredients =
      await IngredientsService.fetchIngredients(url);
  return res.status(HttpStatusCodes.OK).json({ ingredients });
}

// **** Export default **** //

export default {
  fetchIngredients,
} as const;
