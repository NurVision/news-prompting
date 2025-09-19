// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem', 
      backgroundColor: '#333', 
      color: '#fff' 
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
          Bosh sahifa
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
              Mening profilim
            </Link>
            <Link to="/create-article" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
              Yangi maqola
            </Link>
            <button onClick={handleLogout} style={{ 
              color: '#fff', 
              backgroundColor: 'transparent', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
              Chiqish
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
              Tizimga kirish
            </Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>
              Ro‘yxatdan o‘tish
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;