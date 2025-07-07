import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import { Post } from '../types/mongoSchemas';
import { toast } from 'sonner';

type PostConContador = Post & { comentariosVisibles?: number };

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<PostConContador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/user/${user.id}/post`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener posts');
        return res.json();
      })
      .then((data: PostConContador[]) => {
        setPosts(data);
      })
 //     .catch((err) => {
 //       console.error('Error al obtener posts:', err);
 //       setError(err.message);
 //     })
      .catch((err) => {
        toast.error('No se pudieron obtener tus publicaciones', {
          description: err.message || 'Ocurrió un error inesperado.',
          action: {
            label: 'Reintentar',
            onClick: () => window.location.reload() // o llamar a una función personalizada
          }
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const manejarLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleModificarPost = (post: PostConContador) => {
    navigate(`/edit/${post._id}`);
  };

  const handleEliminarPost = async (postId: string) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este post?')) return;

    try {
      const res = await fetch(`${API_URL}/post/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar el post');

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Publicación eliminada correctamente');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error('No se pudo eliminar la publicación'), {
        description: err.message || 'Ocurrió un error inesperado.',
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-4">
      <h2>Perfil de {user.nickname}</h2>

      <button className="btn btn-danger mb-3" onClick={manejarLogout}>
        Cerrar sesión
      </button>

      {loading && <p>Cargando publicaciones...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && posts.length === 0 && (
        <p>No publicaste nada todavía.</p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id || post._id}
          post={post}
          cantidadComentarios={post.comentariosVisibles ?? 0}
          onModificar={() => handleModificarPost(post)}
          onEliminar={() => handleEliminarPost(post._id || post.id)}
        />
      ))}
    </div>
  );
}}
