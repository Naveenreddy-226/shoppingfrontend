import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // CSS file for styling

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [searchInput, setSearchInput] = useState('');

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="flipkart-header">
      <div className="header-left">
        <Link to="/" className="logo">
          MERN Shop
        </Link>
      </div>

      {/* Search bar in the middle */}
      <div className="header-search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="search-input-header"
        />
        <button onClick={handleSearch} className="search-button-header">
          Search
        </button>
      </div>

      <div className="header-right">
        <Link to="/cart" className="header-link">
          Cart
        </Link>
        {userInfo ? (
          <>
            <span className="welcome-text">Hi, {userInfo.name}</span>
            <button className="logout-button" onClick={logoutHandler}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">
              Login
            </Link>
            <Link to="/register" className="header-link">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
