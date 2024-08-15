import React from 'react';
import './App.css';
import RecipeSearch from "./RecipeSearch";
import RecipeGroceriesDisplay from './RecipeGroceriesDisplay';

import { useState } from 'react';

function App() {

  const [recipes, setRecipes] = useState({})

  return (
    <div className="App">
      <header className="App-header">
        <p>🛒<code> grocery list</code> 🍆 🍇 🥒</p>
      </header>
      <div>
        <RecipeSearch />
        <RecipeGroceriesDisplay recipes={recipes}/>
      </div>
    </div>
  );
}

export default App;
