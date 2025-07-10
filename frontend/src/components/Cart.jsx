import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedItems);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.product !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      // Redirect to place order page or directly place order
      alert('Checkout flow not implemented yet.');
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cartItems.length === 0)
    return (
      <div>
        Cart is empty <Link to="/">Go Back</Link>
      </div>
    );

  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.product} style={{ display: 'flex', marginBottom: 10 }}>
          <img src={item.image} alt={item.name} style={{ width: 80, marginRight: 10 }} />
          <div style={{ flex: 1 }}>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <p>
              {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
            </p>
          </div>
          <button onClick={() => removeFromCart(item.product)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={checkoutHandler}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
