import { useState } from 'react';
import './App.css';
import produce from 'immer';

function App() {
  const [pizza, setPizza] = useState({
    name: 'Spicy Pepperoni',
    toppings: ['Mushroom']
  });

  const handleClick = () => {
    setPizza({ ...pizza, toppings: [...pizza.toppings, 'Cheese'] });
  };
  return (
    <>
      <div>{pizza.toppings}</div>
      <button onClick={handleClick}>Press Me</button>
    </>
  );
}

export default App;
