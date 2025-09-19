import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Yangi import
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail'; // Qo'shildi
import Login from './components/Login';
import Profile from './components/Profile';
import ArticleCreate from './components/ArticleCreate'; // Qo'shildi
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar komponentini qo'shish */}
      <div className="App">
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} /> 
          <Route path="/create-article" element={<ArticleCreate />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;