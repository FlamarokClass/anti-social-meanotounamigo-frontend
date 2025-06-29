import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/constants";
import { Tag, User } from '../types/mongoSchemas';

export default function NewPost() {
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then(res => res.json())
      .then((data: Tag[]) => setTags(data));
  }, []);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return null;
    }
    
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descripcion,
        etiquetas: selectedTags,
        user: user._id
      }),
    });

    const newPost = await res.json();

    await Promise.all(
      imageUrls.filter(url => url).map(url =>
        fetch(`${API_URL}/post-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        }).then(res => res.json())
         .then(image => 
           fetch(`${API_URL}/posts/${newPost._id}/images`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ imageIds: [image._id] })
           })
         )
      )
    );

    navigate('/profile');
  };

  return (
    <div className="container mt-4">
      <h2>Nueva publicación</h2>
      <form onSubmit={manejarSubmit}>
        <textarea
          required
          className="form-control mb-2"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        {imageUrls.map((url, i) => (
          <input
            key={i}
            className="form-control mb-1"
            value={url}
            onChange={e => {
              const newUrls = [...imageUrls];
              newUrls[i] = e.target.value;
              setImageUrls(newUrls);
            }}
            placeholder="URL de imagen"
          />
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary mb-2"
          onClick={() => setImageUrls([...imageUrls, ''])}
        >
          Agregar otra imagen
        </button>

        <select
          multiple
          className="form-control mb-2"
          onChange={e =>
            setSelectedTags([...e.target.selectedOptions].map(o => o.value))
          }
        >
          {tags.map(tag => (
            <option key={tag._id} value={tag._id}>
              {tag.nombre}
            </option>
          ))}
        </select>

        <button className="btn btn-success">Publicar</button>
      </form>
    </div>
  );
}