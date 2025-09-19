import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Comments from './Comments'; // Qo'shildi

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${slug}/`);
        setArticle(response.data);
      } catch (error) {
        console.error("Maqola yuklanmadi yoki topilmadi!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (!article) {
    return <div>Maqola topilmadi.</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      {article.cover_image_url ? (
        <img src={article.cover_image_url} alt={article.title} style={{ maxWidth: '100%' }} />
      ) : (
        <p>Rasmsiz maqola.</p>
      )}
      {article.content ? (
        <p>{article.content}</p>
      ) : (
        <p>To'liq matn mavjud emas.</p>
      )}

      <hr />
      {/* Sharhlar komponentini qo'shamiz */}
      <Comments articleSlug={slug} />
    </div>
  );
};

export default ArticleDetail;