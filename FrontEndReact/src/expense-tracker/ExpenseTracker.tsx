import { useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilter } from './components/ExpenseFilter';
import { ExpenseList } from './components/ExpenseList';

export const ExpenseTracker = () => {
  //State of the selected category
  const [selectedCategory, setSelectedCategory] = useState('');

  //Array of the expense objects
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'aaa', amount: 10.5, category: 'Utilities' },
    { id: 2, description: 'bbb', amount: 25.0, category: 'Groceries' },
    { id: 3, description: 'ccc', amount: 25.0, category: 'Groceries' },
    { id: 4, description: 'ddd', amount: 25.0, category: 'Entertainment' }
  ]);

  //Conditional Logic, if there is a selected category, only contain objects filtered to that category
  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  return (
    <>
      {/* This is the Expense Form. On submit, it appends the new object to the data structure. This utilizes the state hook. */}
      <div className="mb-5">
        <ExpenseForm
          onSubmit={(expense) =>
            setExpenses([...expenses, { ...expense, id: expenses.length + 1 }])
          }
        />
      </div>

      {/* This is the filter selector. It sets the displayed category based on the current selection */}
      <div className="mb-3">
        <ExpenseFilter
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </div>

      {/* This is the filter selector. It sets the displayed category based on the current selection */}
      <div className="mb-3">
        <ExpenseList
          expenses={visibleExpenses}
          onDelete={(id) => setExpenses(expenses.filter((e) => e.id !== id))}
        ></ExpenseList>
      </div>
    </>
  );
};
