import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import styles from './Cart.module.css';

const stripePromise = loadStripe('pk_test_51RlVZRPIoDMmW2tUCfePSg7Vtmll3KLWzlF3UfCuPqSTtEkYqqfxpumwR3vYTLGbbXO8kJ5bDFwFsrUtI8LUCEBC00enWAfC27'); // use your test publishable key

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setCartItems([]);
      return;
    }
    const userEmailKey = userInfo.email.replace(/[.@]/g, '_');
    const cartKey = `cartItems_${userEmailKey}`;
    const storedItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedItems);
  }, []);

  const removeFromCart = (id) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return;

    const userEmailKey = userInfo.email.replace(/[.@]/g, '_');
    const cartKey = `cartItems_${userEmailKey}`;

    const updatedCart = cartItems.filter((item) => item.product !== id);
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const checkoutHandler = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const stripe = await stripePromise;

    const response = await fetch('https://shoppingbackend-ivrt.onrender.com/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await response.json();

    if (data.id) {
      await stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Failed to initiate checkout');
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cartItems.length === 0)
    return (
      <div className={styles.emptyCart}>
        Cart is empty <Link to="/">Go Back</Link>
      </div>
    );

  return (
    <div className={styles.cartContainer}>
      {cartItems.map((item) => (
        <div key={item.product} className={styles.cartItem}>
          <img src={item.image} alt={item.name} className={styles.itemImage} />
          <div className={styles.itemDetails}>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <p>
              {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
            </p>
          </div>
          <button onClick={() => removeFromCart(item.product)} className={styles.removeBtn}>
            Remove
          </button>
        </div>
      ))}
      <h3 className={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={checkoutHandler} className={styles.checkoutBtn}>
        Pay with Stripe
      </button>
    </div>
  );
};

export default Cart;
