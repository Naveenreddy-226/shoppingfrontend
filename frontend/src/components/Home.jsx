import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [products, setProducts] = useState([]);
  const query = useQuery();
  const searchTerm = query.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get('/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Filter products by URL search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="home-container">
      {/* You can optionally display the current search term or a clear button here */}

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="horizontal-scroll">
            {items.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                </Link>
                <p>${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
