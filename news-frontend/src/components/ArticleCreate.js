import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ArticleCreate = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newArticle = { title, excerpt, content };

    try {
      const response = await api.post('/articles/', newArticle);
      if (response.status === 201) {
        navigate(`/articles/${response.data.slug}`);
      }
    } catch (err) {
      console.error("Maqola yaratishda xato: ", err);
      if (err.response) {
        // Serverdan javob bor, lekin xato status
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        setError(
          "Xatolik: " +
          (err.response.data.detail || JSON.stringify(err.response.data))
        );
      } else if (err.request) {
        // So‘rov yuborildi, lekin javob kelmadi
        console.error("No response received:", err.request);
        setError("Serverdan javob kelmadi.");
      } else {
        // So‘rovni yuborishda xatolik
        console.error("Error message:", err.message);
        setError("So‘rovni yuborishda xatolik.");
      }
    }
  };

  return (
    <div>
      <h2>Yangi maqola yaratish</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sarlavha:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Qisqa matn:</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
        </div>
        <div>
          <label>To'liq matn:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required style={{ minHeight: '200px' }} />
        </div>
        <button type="submit">Maqolani saqlash</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default ArticleCreate;