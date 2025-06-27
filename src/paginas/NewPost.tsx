import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NewPost() {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/tags`)
      .then(res => res.json())
      .then(setTags);
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.VITE_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, tags: selectedTags, userId: user._id })
    });
    const newPost = await res.json();
    await Promise.all(imageUrls.filter(url => url).map(url =>
      fetch(`${process.env.VITE_API_URL}/postimages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, postId: newPost._id })
      })
    ));
    navigate('/profile');
  };

  return (
    <div className="container mt-4">
      <h2>Nueva publicación</h2>
      <form onSubmit={manejarSubmit}>
        <textarea required className="form-control mb-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" />
        {imageUrls.map((url, i) => (
          <input key={i} className="form-control mb-1" value={url} onChange={e => {
            const newUrls = [...imageUrls];
            newUrls[i] = e.target.value;
            setImageUrls(newUrls);
          }} placeholder="URL de imagen" />
        ))}
        <button type="button" className="btn btn-sm btn-outline-secondary mb-2" onClick={() => setImageUrls([...imageUrls, ''])}>Agregar otra imagen</button>
        <select multiple className="form-control mb-2" onChange={e => setSelectedTags([...e.target.selectedOptions].map(o => o.value))}>
          {tags.map(t => <option key={t._id} value={t.nombre}>{t.nombre}</option>)}
        </select>
        <button className="btn btn-success">Publicar</button>
      </form>
    </div>
  );
}