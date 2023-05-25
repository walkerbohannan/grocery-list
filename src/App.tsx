import React from 'react';
import './App.css';
import RecipeSearch from "./RecipeSearch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>🛒<code> grocery list</code> 🍆 🍇 🥒</p>
      </header>
      <div>
        <RecipeSearch />
      </div>
    </div>
  );
}

export default App;
