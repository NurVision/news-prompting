import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles/');

        // Backenddan kelgan javobni tekshiramiz.
        // Agar pagination ishlatilgan bo'lsa, 'results' kalitidan foydalanamiz.
        const articlesData = response.data.results || response.data;
        setArticles(articlesData);

      } catch (error) {
        console.error("Maqolalar yuklanmadi!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div>
      <h1>Eng so'nggi yangiliklar</h1>
      {Array.isArray(articles) && articles.length > 0 ? (
        articles.map((article) => (
          <div key={article.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            {/* Sahifalararo o'tish uchun Link komponentidan foydalanamiz */}
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <Link to={`/articles/${article.slug}`}>
                <button>Batafsil</button>
            </Link>
          </div>
        ))
      ) : (
        <div>Hozircha maqolalar mavjud emas.</div>
      )}
    </div>
  );
};

export default ArticleList;