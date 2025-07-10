import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existing = cartItems.find((item) => item.product === product._id);
    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, qty });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.image} alt={product.name} style={{ width: 300 }} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Stock: {product.countInStock}</p>
      {product.countInStock > 0 && (
        <div>
          <label>Qty: </label>
          <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {[...Array(product.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={addToCartHandler} disabled={product.countInStock === 0}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
