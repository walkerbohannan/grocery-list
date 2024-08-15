import React, { useState, ChangeEvent, FormEvent } from 'react';
import './RecipeSearch.css';

export default function RecipeSearch() {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [recipes, setRecipes] = useState([{
    title: '',
    url: ''
  }]);

  function Recipes() {
    if (recipes.length > 0 && recipes[0].title !== '') {
      return (
        <div className="recipes">
          <h2>Recipes</h2>
          { recipes.map(recipe => {
            return (
              <div key={recipe.url}>
                <a className="link" href={recipe.url}>{recipe.title}</a>
              </div>
            )}
          )}
        </div>
      )
    } else {
        return null;
    }
  }

  function Ingredients() {
    if (ingredients.length > 0 && ingredients[0].ingredient !== '') {
      return (
        <div>
          <h2>Ingredients</h2>
          { ingredients.map(ingredient => {
            return (
                  <div key={ingredient.id} className="ingredient">
                    <input type="checkbox"/> {ingredient.quantity} {ingredient.measurement} {ingredient.ingredient}
                  </div>
            )
          })
          }
        </div>
      )
    } else {
      return null;
    }
  }

  const [ingredients, setIngredients] = useState([{
    id: 0,
    quantity: 0,
    measurement: '',
    ingredient: ''
  }]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') {
      setError('Please enter a search query');
      return;
    }
    onSubmit(query);
    setError('');
  };

  async function onSubmit(query: string) {
    let data = {
      "url": query
    }
    const response  =
          await fetch('http://localhost:8000/ingredients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)}
          );
    const body = await response.json();
    console.log(body);
    console.log(body.ingredients);

    if (ingredients.length === 1) {
      setIngredients([])
    }

    body.ingredients.map((ingredient: { id: number; quantity: number; measurement: string; ingredient: string; }) => setIngredients(prevState => [...prevState, ingredient]))

    const recipe = {
      title: body.title,
      url: body.url
    }

    if (recipes.length === 1) {
      setRecipes([])
    }

    setRecipes(prevState => [...prevState, recipe])

  }


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  return (
    <div className="recipe-and-ingredients">
      <form className= "recipe-search-box" onSubmit={handleSubmit}>
        <input
          className="input-box"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
        />
        <button className="search-button" type="submit">Search</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>

      <br></br>

      <Recipes></Recipes>
      <Ingredients></Ingredients>
    </div>

  );
};

// import React, {useState} from 'react';
// import './RecipeSearch.css'
//
// export default function RecipeSearch() {
//
//   const [errorMessage, setErrorMessage] = useState({
//     fromFetch: ''
//   })
// //     function handleSubmit(e: any) {
//         e.preventDefault()
//         const form = e.target;
//         const formData = new FormData(form)
//
//         const ingredientList =
//           fetch('http://localhost:8000/ingredients', { method: form.method, body: formData})
//             .catch(reason => {
//               setErrorMessage({
//                 fromFetch: "Could not fetch ingredients from website: " + reason.message
//               })
//               console.error(reason.message)
//             });
//         console.log(ingredientList)
//     }
//
//     return (
//         <form method="post" onSubmit={handleSubmit}>
//             <label className="recipe-search-label">
//                 Enter recipe URL:
//                 <textarea className="recipe-search-textarea"
//                           name="postContent"
//                           defaultValue="https://cooking.nytimes.com/recipes/1020829-sheet-pan-gochujang-chicken-and-roasted-vegetables"
//                           rows={2} cols={60}/>
//             </label>
//             <br/>
//             <button type="submit">Fetch ingredients</button>
//             <div>
//               <br/>
//               {errorMessage['fromFetch'] ? errorMessage['fromFetch'] : <></>}
//             </div>
//         </form>
// );
//   function search(formData: FormData): string {
//     const query = formData.get("query") as string;
//     alert(`You searched for '${query}'`);
//     return query;
//   }
//   return (
//     <form action={search}>
//       <input name="query" />
//       <button type="submit">Search</button>
//     </form>
//   );
// }