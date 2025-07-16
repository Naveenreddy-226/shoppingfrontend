import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import styles from './ProductDetails.module.css';

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
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      alert('Please log in to add items to the cart.');
      navigate('/login');
      return;
    }

    const userEmailKey = userInfo.email.replace(/[.@]/g, '_');
    const cartKey = `cartItems_${userEmailKey}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = cartItems.find((item) => item.product === product._id);

    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <div className={styles.details}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p className={product.countInStock > 0 ? styles.stock : styles.outOfStock}>
          {product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
        </p>
        {product.countInStock > 0 && (
          <div className={styles.qtySelector}>
            <label htmlFor="qty">Qty:</label>
            <select id="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          className={styles.button}
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
