import {IIngredient, IngredientsResponse} from "../models/Ingredient";
import * as cheerio from 'cheerio';
import {Element, ItemNode} from '../models/ParsedHtmlElements';
import {CheerioAPI} from "cheerio";

const measurementsToG = new Map<String, number>([
  [
    'tablespoon', 14.175
  ],
  [
    'tablespoons', 14.175
  ],
  [
    'cup', 340
  ],
  [
    'cups', 340
  ],
  [
    'pound', 453.592
  ],
  [
    'pounds', 453.592
  ],
  [
    'lb', 453.592
  ],
  [
    'lbs', 453.592
  ],
  [
    'teaspoon', 5.69
  ],
  [
    'teaspoons', 5.69
  ],
  [
    'gram', 1
  ],
  [
    'grams', 1
  ],
  [
    'g', 1
  ],
  [
    'ounce', 28.3495
  ],
  [
    'ounces', 28.3495
  ],
  [
    'oz', 28.3495
  ],
  [
    'kg', 1000
  ],
  [
    'kgs', 1000
  ],
]);

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
  if (measurementsToG.has(firstWord)) {
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

function extractNyTimesIngredients($: CheerioAPI, url: string) {
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

class MeasurementNotFound implements Error {
  constructor(message: string) {
    this.message = message;
    this.name = "MeasurementNotFound"
  }

  message: string;
  name: string;
}

function convertMeasurements(from: string, to: string, value: number): number {
  if (!measurementsToG.has(from) || !measurementsToG.has(to)) {
    throw new MeasurementNotFound(`Could not convert measurement: unknown measurement $from`)
  }

  const measurementInGrams =  value * measurementsToG.get(from)!
  return measurementInGrams / measurementsToG.get(to)!;
}

function parseSmittenKitchenIngredient(data: string) {
  let quantity = "";
  let ingredient = "";
  let measurement = "";
  let strings = data.split(" ");
  let conversion = false
  let index = 0;
  while (index < strings.length) {
    const string = strings[index];
    // omit conversions in parentheses
    if (string.startsWith("(")) {
      conversion = true
    }

    if (!conversion) {
      if (parseInt(string)) {
        quantity += string + " "
      } else if (measurementsToG.has(string)) {
        measurement = string
      } else if (string == 'plus') {
        if (index + 1 < strings.length) {
          index++;
          let quantityToAdd = strings[index];
          if (parseInt(quantityToAdd)) {
            if (index + 1 < strings.length) {
              index++;
              let measurementToAdd = strings[index];
              if (measurementsToG.has(measurementToAdd)) {
                let convertedQuantityToAdd = convertMeasurements(measurementToAdd, measurement, parseInt(quantityToAdd));
                let newQuantity = eval(quantity) + convertedQuantityToAdd;
                quantity = "" + newQuantity;
              } else {
                throw new MeasurementNotFound(`Could not find measurement ${measurementToAdd}`)
              }
            } else {
              throw new MeasurementNotFound("Found end of ingredient...");
            }
          } else {
            throw new MeasurementNotFound("Not a number to add to measurement.");
          }
        }
      } else {
        ingredient += string + " "
      }
    }

    if (string.endsWith(")") && conversion) {
      conversion = false
    }

    index++;
  }

  return {
    quantity: quantity.trim(),
    ingredient: ingredient.trim(),
    measurement: measurement.trim()
  }
}

function extractSmittenKitchenIngredients($: CheerioAPI, url: string) {
  const $titleNode = $('[property*=title]')[0].attribs.content
  let ingredients = $('.ingredient');
  const recipeIngredients = [];
  for (let index = 0; index < ingredients.length; index++) {
    let child = ingredients[index].children[0] as ItemNode;
    recipeIngredients.push(parseSmittenKitchenIngredient(child.data));
  }
  return {
    ingredients: recipeIngredients,
    url,
    title: $titleNode
  }
}

async function fetchIngredients(url: string): Promise<IngredientsResponse> {
  const html = await fetchHtml(url); //TODO proper handling of invalid URLs
  const $ = cheerio.load(html);
  return Promise.resolve(extractNyTimesIngredients($, url));
}

export default {
  fetchIngredients,
  extractNyTimesIngredients,
  extractSmittenKitchenIngredients
} as const;
