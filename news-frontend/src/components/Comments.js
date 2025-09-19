import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CommentForm = ({ articleSlug, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backendga yangi sharh qo'shish so'rovi
      const response = await api.post(`/articles/${articleSlug}/comments/`, { content });
      if (response.status === 201) { // Agar sharh muvaffaqiyatli yaratilgan bo'lsa
        setContent(''); // Formani tozalash
        onCommentAdded(); // Ota komponentga sharhlarni qayta yuklashni aytish
      }
    } catch (err) {
      console.error("Sharh qo'shishda xato: ", err);
      setError("Sharh qo'shishda xato yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Sharhingizni yozing..."
        required
      />
      <button type="submit">Yuborish</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

const Comments = ({ articleSlug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/articles/${articleSlug}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error("Sharhlar yuklanmadi!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  return (
    <div>
      <h3>Sharhlar ({comments.length})</h3>
      {loading ? (
        <p>Sharhlar yuklanmoqda...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <strong>{comment.author_username}</strong>: {comment.content}
          </div>
        ))
      ) : (
        <p>Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!</p>
      )}
      
      {/* Sharh qo'shish formasi */}
      <CommentForm articleSlug={articleSlug} onCommentAdded={fetchComments} />
    </div>
  );
};

export default Comments;