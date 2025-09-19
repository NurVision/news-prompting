import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ phone: '', address: '', website: '' });
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    api.get('/profile/me/')
      .then(res => {
        setProfile(res.data);
        setForm({
          phone: res.data.phone || '',
          address: res.data.address || '',
          website: res.data.website || ''
        });
      })
      .catch(() => setError("Profilni yuklab bo'lmadi"));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const res = await api.put('/profile/me/', form);
      setProfile(res.data);
      setEdit(false);
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        // Backenddan kelgan validation xatoliklarni ko‘rsatish
        const errors = Object.values(err.response.data).flat().join(' ');
        setError("Xatolik: " + errors);
      } else {
        setError("Profilni saqlashda xato");
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      await api.patch('/profile/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.reload();
    } catch {
      setError("Avatar yuklashda xato");
    }
  };

  if (!profile) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      <h2>Profil</h2>
      <p><strong>Foydalanuvchi:</strong> {profile.user.username}</p>
      <p><strong>Email:</strong> {profile.user.email}</p>
      <p><strong>Telefon:</strong> {profile.phone}</p>
      <p><strong>Manzil:</strong> {profile.address}</p>
      <p><strong>Sayt:</strong> {profile.website}</p>
      {profile.avatar && !avatarPreview && (
        <img src={profile.avatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
      )}
      {avatarPreview && (
        <img src={avatarPreview} alt="Avatar preview" style={{ width: 100, height: 100, borderRadius: '50%' }} />
      )}
      <form onSubmit={handleAvatarUpload}>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <button type="submit">Avatar yuklash</button>
      </form>
      {edit ? (
        <form onSubmit={handleSave}>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Manzil" />
          <input name="website" value={form.website} onChange={handleChange} placeholder="Sayt" />
          <button type="submit">Saqlash</button>
        </form>
      ) : (
        <button onClick={() => setEdit(true)}>Tahrirlash</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Profile;