import React from "react";
import './RecipeSearch.css'

export default function RecipeSearch() {
    function handleSubmit(e: any) {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)

        const ingredientList = fetch('http://localhost:5001/ingredients', { method: form.method, body: formData});
        console.log(ingredientList)
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label className="recipe-search-label">
                Enter recipe URL:
                <textarea className="recipe-search-textarea"
                          name="postContent"
                          defaultValue="https://cooking.nytimes.com/recipes/1020829-sheet-pan-gochujang-chicken-and-roasted-vegetables"
                          rows={2} cols={60}/>
            </label>
            <br/>
            <button type="submit">Fetch ingredients</button>
        </form>
);
}