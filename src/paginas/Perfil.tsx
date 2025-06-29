import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/constants";
import { Post } from '../types/mongoSchemas'; // Importación correcta

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then((data: Post[]) => {
        const propios = data.filter(post => post.user === user._id);
        setPosts(propios);
      });
  }, [user]);

  if (!user) return <p>Cargando perfil...</p>;

  const manejarLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <h2>Perfil de {user.nickname}</h2>
      <button className="btn btn-danger mb-3" onClick={manejarLogout}>
        Cerrar sesión
      </button>
      {posts.map(p => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
}
