import {IIngredient, IngredientsResponse} from '@src/models/Ingredient';
import * as cheerio from 'cheerio';

interface ItemNode {
    data: string,
    type: string,
}

interface Element {
    attribs: {
        class: string
    },
    children: [
        {
            data: string
        }
    ]
}

const measurements = [
  'tablespoon',
  'tablespoons',
  'cup',
  'cups',
  'pound',
  'pounds',
  'teaspoon',
  'teaspoons',
  'gram',
  'grams',
  'ounce',
  'ounces',
  'oz',
  'lb' ,
  'lbs' ,
  'kg',
  'kgs',
  'g',
];

function getMeasurement(quantity: string) {
    //todo
}

async function fetchIngredients(url: string): Promise<IngredientsResponse> {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const $ingredients = $('[class*=ingredient_ingredient]');

  const finalIngredients = [];

  // $('[class*=ingredient_ingredient]')[0].children[0].children[0].data
  for (const item of $ingredients) {
    // iterate through each line in ingredient list
    let quantity = '';
    let ingredient = '';

    const itemContents: Element[] = item.children as unknown as Element[];
    for (const quantityOrIngredient of itemContents) {
      if (quantityOrIngredient.attribs.class &&
          quantityOrIngredient.attribs.class.includes('quantity')) {
        quantity = quantityOrIngredient.children[0].data;
      } else {
        ingredient = quantityOrIngredient.children[0].data;
      }
    }

    const measurement = getMeasurement(quantity);

    const iIngredient = {
      quantity,
      measurement: '',
      ingredient,
    } as IIngredient;
    finalIngredients.push(iIngredient);
  }

  const titleNode: ItemNode =
      $('[class*=title-display]')[0].children[0] as ItemNode;
  const ingredientsResponse =
      {
        ingredients: finalIngredients,
        url,
        title: titleNode.data,
      } as IngredientsResponse;

  return Promise.resolve(ingredientsResponse);
}

export default {
  fetchIngredients,
} as const;
