import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get('/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
      {products.map((product) => (
        <div key={product._id} style={{ border: '1px solid #ddd', padding: 10, width: 200 }}>
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} style={{ width: '100%' }} />
            <h3>{product.name}</h3>
          </Link>
          <p>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
