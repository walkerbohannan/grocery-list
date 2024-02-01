export interface IIngredient {
    quantity: number,
    measurement: string,
    ingredient: string
}

export interface IngredientRequest {
    url: string,
}

export interface IngredientsResponse {
    ingredients: IIngredient[],
    url: string,
    title: string
}