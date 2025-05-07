import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Header.css';

const Header = ({ userInfo, setUserInfo }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🔖</span>
          <span className="logo-text">Link Saver</span>
        </Link>

        <nav className="nav">
          {userInfo ? (
            <div className="nav-user">
              <span className="nav-email">{userInfo.email}</span>
              <button onClick={logoutHandler} className="btn btn-sm btn-secondary">
                Log Out
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-sm btn-secondary mr-2">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;