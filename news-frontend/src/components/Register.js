import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register/', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError('Ro‘yxatdan o‘tishda xato: ' + (err.response?.data?.username || err.response?.data?.email || err.response?.data?.password || ''));
    }
  };

  return (
    <div>
      <h2>Ro‘yxatdan o‘tish</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Ro‘yxatdan o‘tish</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;