import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backendga tizimga kirish so'rovini yuborish
      const response = await api.post('/token/', { username, password });
      // yoki
      // const response = await api.post('/api/token/', { username, password });

      // JWT tokenini brauzerning localStorage'iga saqlash
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Foydalanuvchini bosh sahifaga yo'naltirish
      navigate('/');
    } catch (err) {
      console.error("Login xatosi: ", err);
      if (err.response && err.response.status === 401) {
        setError("Noto'g'ri foydalanuvchi nomi yoki parol.");
      } else {
        setError("Tizimga kirishda xato yuz berdi. Iltimos, qayta urinib ko'ring.");
      }
    }
  };

  return (
    <div>
      <h2>Tizimga kirish</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Foydalanuvchi nomi:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Parol:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Kirish</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;