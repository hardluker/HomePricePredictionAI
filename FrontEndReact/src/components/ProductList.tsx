import { useEffect, useState } from 'react';

export const ProductList = () => {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching products');
    setProducts(['Clothing', 'Household']);
  }, []);

  return <div>ProductList</div>;
};
