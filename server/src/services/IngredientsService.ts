import {IIngredient, IngredientsResponse} from "../models/Ingredient";
import * as cheerio from 'cheerio';
import {Element, ItemNode} from '../models/ParsedHtmlElements';

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

function firstSpaceIndex(quantity: string): number {
  for (let i = 0; i < quantity.length; i++) {
    if (quantity[i] === ' ') {
      return i;
    }
  }
  return quantity.length;
}

function getIIngredient(quantity: string, ingredient: string): IIngredient {
  let measurement = '';
  const firstWord = ingredient.substring(0, firstSpaceIndex(ingredient));
  if (measurements.includes(firstWord)) {
    measurement = firstWord;
    ingredient = ingredient.substring(
      firstSpaceIndex(ingredient) + 1,
      ingredient.length);
  }
  return {
    quantity,
    measurement,
    ingredient,
  } as IIngredient;
}

async function fetchHtml(url: string) {
  const response = await fetch(url);
  return await response.text();
}

function extractNyTimesIngredients(html: string, url: string) {
  const $ = cheerio.load(html);
  const $ingredients = $('[class*=ingredient_ingredient]');
  const $titleNode: ItemNode = $('[class*=title-display]')[0].children[0] as ItemNode;

  const finalIngredients = [];

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

    const iIngredient = getIIngredient(quantity, ingredient);

    finalIngredients.push(iIngredient);
  }

  return {
    ingredients: finalIngredients,
    url,
    title: $titleNode.data,
  } as IngredientsResponse;
}

async function fetchIngredients(url: string): Promise<IngredientsResponse> {
  return Promise.resolve(extractNyTimesIngredients(await fetchHtml(url), url));
}

export default {
  fetchIngredients,
  extractNyTimesIngredients,
} as const;
