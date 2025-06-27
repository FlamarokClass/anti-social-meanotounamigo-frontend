import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/posts?userId=${user._id}`)
      .then(res => res.json())
      .then(setPosts);
  }, [user]);

  const manejarLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <h2>Perfil de {user.nickName}</h2>
      <button className="btn btn-danger mb-3" onClick={manejarLogout}>Cerrar sesión</button>
      {posts.map(p => <PostCard key={p._id} post={p} />)}
    </div>
  );
}