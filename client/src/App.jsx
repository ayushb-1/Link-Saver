import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookmarkDashboard from './components/bookmarks/BookmarkDashboard';
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const user = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;
    
    setUserInfo(user);
    setLoading(false);
  }, []);

  return (
    <div className="app">
      <Header userInfo={userInfo} setUserInfo={setUserInfo} />
      
      <main className="container">
        {!loading && (
          <Routes>
            <Route 
              path="/" 
              element={
                userInfo 
                  ? <Navigate to="/bookmarks" replace /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/login" 
              element={
                userInfo 
                  ? <Navigate to="/bookmarks" replace /> 
                  : <Login setUserInfo={setUserInfo} />
              } 
            />
            <Route 
              path="/register" 
              element={
                userInfo 
                  ? <Navigate to="/bookmarks" replace /> 
                  : <Register setUserInfo={setUserInfo} />
              } 
            />
            <Route 
              path="/bookmarks" 
              element={
                <PrivateRoute userInfo={userInfo}>
                  <BookmarkDashboard userInfo={userInfo} />
                </PrivateRoute>
              } 
            />
          </Routes>
        )}
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;