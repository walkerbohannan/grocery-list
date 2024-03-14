import IngredientsService from "../../src/services/IngredientsService";
import {IngredientsResponse} from "../../src/models/Ingredient";
import {readFile} from "node:fs/promises";
import * as cheerio from 'cheerio';

async function content(path: string) {
    return await readFile(path, 'utf8')
}
describe('IngredientsService', () => {

    describe('Should parse ingredients',  () => {

        it('From a NY Times recipe page', async () => {
            const html = await content('./test/resources/nytimes_cooking.html');
            const url = 'https://cooking.nytimes.com/recipes/1020829-sheet-pan-gochujang-chicken-and-roasted-vegetables';
            const $ = cheerio.load(html)
            const ingredientsResponse = IngredientsService.extractNyTimesIngredients($, url);
            const expectedIngredientsResponse = {
                ingredients: [
                    {quantity:'3',measurement:'tablespoons',ingredient:'gochujang'},
                    {quantity:'2',measurement:'tablespoons',ingredient:'soy sauce'},
                    {quantity:'1',measurement:'',ingredient:'(1-inch) piece fresh ginger, peeled and grated (about 1 tablespoon)'},
                    {quantity:'3',measurement:'tablespoons',ingredient:'neutral oil, like grapeseed or canola, plus more for drizzling'},
                    {quantity:'2',measurement:'pounds',ingredient:'squash, such as butternut, acorn or delicata, unpeeled, seeded and cut into 2-inch pieces (about 5 loose cups)'},
                    {quantity:'1',measurement:'pound',ingredient:'turnips, trimmed and cut into 2-inch pieces (about 3½ loose cups)'},
                    {quantity:'10',measurement:'',ingredient:'scallions, ends trimmed, green and white parts separated, but not chopped'},
                    {quantity:'',measurement:'',ingredient:'Kosher salt'},
                    {quantity:'2½ to 3',measurement:'pounds',ingredient:'bone-in, skin-on chicken thighs, drumsticks or breasts, patted dry'},
                    {quantity:'1',measurement:'',ingredient:'bunch radishes (about 10 ounces), trimmed'},
                    {quantity:'2',measurement:'tablespoons',ingredient:'rice vinegar'},
                    {quantity:'1',measurement:'tablespoon',ingredient:'sesame oil (optional)'},
                    {quantity:'',measurement:'',ingredient:'Steamed rice (optional)'},
                ],
                url,
                title:'Sheet-Pan Gochujang Chicken and Roasted Vegetables',
            } as IngredientsResponse;
            expect(ingredientsResponse).toStrictEqual(expectedIngredientsResponse);
        });

        it('From a Smitten Kitchen recipe page', async () => {
            const html = await content('./test/resources/smitten_kitchen.html');
            const url = 'https://smittenkitchen.com/2016/02/everyday-meatballs/';
            const $ = cheerio.load(html)
            const ingredientsResponse = IngredientsService.extractSmittenKitchenIngredients($, url);
            const expectedIngredientsResponse = {
                ingredients: [
                    {quantity:'6',measurement:'',ingredient:'large egg whites'},
                    {quantity:'1 1/2',measurement:'cups',ingredient:'granulated sugar'},
                    {quantity:'1/4',measurement:'teaspoon',ingredient:'kosher salt'},
                    {quantity:'1 1/2',measurement:'teaspoons',ingredient:'balsamic or red wine vinegar'},
                    {quantity:'1/4',measurement:'cup',ingredient:'unsweetened cocoa powder, any kind, sifted if lumpy'},
                    {quantity:'2',measurement:'ounces',ingredient:'semi- or bittersweet chocolate, finely chopped'},
                    {quantity:'12',measurement:'ounces',ingredient:'fresh or defrosted raspberries'},
                    {quantity:'2',measurement:'tablespoons',ingredient:'fresh lemon juice'},
                    {quantity:'0.5833823529411765',measurement:'cup',ingredient:'granulated sugar'},
                    {quantity:'6',measurement:'',ingredient:'large egg yolks'},
                    {quantity:'3',measurement:'tablespoons',ingredient:'unsalted butter'},
                    {quantity:'4',measurement:'ounces',ingredient:'semi- or bittersweet chocolate, finely chopped'},
                    {quantity:'2',measurement:'cups',ingredient:'heavy cream, divided'},
                    {quantity:'2',measurement:'teaspoons',ingredient:'granulated sugar'},
                    {quantity:'1',measurement:'teaspoon',ingredient:'vanilla extract'},
                    {quantity:'1',measurement:'cup',ingredient:'fresh raspberries'},
                    {quantity:'',measurement:'',ingredient:'Powdered sugar, for dusting'},
                ],
                url,
                title:'chocolate raspberry pavlova stack',
            } as IngredientsResponse;
            expect(ingredientsResponse).toStrictEqual(expectedIngredientsResponse);
        });
    })
});