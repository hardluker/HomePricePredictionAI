import { useState } from 'react';
import './App.css';

function App() {
  const [customer, setCustomer] = useState({
    name: 'John',
    address: {
      city: 'San Francisco',
      zipCode: 94111
    }
  });

  const handleClick = () => {
    const updatedCustomer = {
      ...customer,
      address: { ...customer.address, zipCode: 94112 }
    };
    setCustomer(updatedCustomer);
    console.log(updatedCustomer);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleClick}>
        Press Me
      </button>
    </div>
  );
}

export default App;
