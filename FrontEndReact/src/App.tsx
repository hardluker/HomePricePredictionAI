import './App.css';
import { ProductList } from './components/ProductList';
import { ExpenseTracker } from './expense-tracker/ExpenseTracker';
import { useEffect, useRef } from 'react';

function App() {
  const ref = useRef<HTMLInputElement>(null);

  //Performs after rendering
  useEffect(() => {});

  return (
    <div>
      <select className="form-select">
        <option value=""></option>
        <option value="Clothing">Clothing</option>
        <option value="Household">Household</option>
      </select>
      <ProductList />
    </div>
  );
}

export default App;
