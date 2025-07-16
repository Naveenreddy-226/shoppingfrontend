import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';
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

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      alert('Checkout flow not implemented yet.');
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
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
