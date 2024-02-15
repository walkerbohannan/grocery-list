import IngredientsService from "../../src/services/IngredientsService";
import {IngredientsResponse} from "../../src/models/Ingredient";
import {readFile} from "node:fs/promises";

async function content(path: string) {
    return await readFile(path, 'utf8')
}
describe('IngredientsService', () => {
    it('Should parse out ingredients from NY Times recipe page', async () => {
        const html = await content('./test/resources/gochujang.html');
        const url = 'https://cooking.nytimes.com/recipes/1020829-sheet-pan-gochujang-chicken-and-roasted-vegetables';
        const ingredientsResponse = IngredientsService.extractNyTimesIngredients(html, url);
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
            url:'https://cooking.nytimes.com/recipes/1020829-sheet-pan-gochujang-chicken-and-roasted-vegetables',
            title:'Sheet-Pan Gochujang Chicken and Roasted Vegetables',
        } as IngredientsResponse;
        expect(ingredientsResponse).toStrictEqual(expectedIngredientsResponse);
    });
});