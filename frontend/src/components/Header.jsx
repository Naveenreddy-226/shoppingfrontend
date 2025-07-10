import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header style={{ padding: '10px 20px', backgroundColor: '#222', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          MERN Shop
        </Link>
        <div>
          <Link to="/cart" style={{ color: '#fff', marginRight: 20 }}>
            Cart
          </Link>
          {userInfo ? (
            <>
              <span style={{ marginRight: 20 }}>Hi, {userInfo.name}</span>
              <button onClick={logoutHandler}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff', marginRight: 10 }}>
                Login
              </Link>
              <Link to="/register" style={{ color: '#fff' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
