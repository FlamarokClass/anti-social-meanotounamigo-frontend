import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import { Post } from '../types/mongoSchemas';
import { toast } from 'sonner';
import PageWrapper from '../components/Animated';
import EditPostModal from '../components/EditPostModal';
import { Modal } from 'react-bootstrap';

interface Tag {
  _id?: string;
  id?: string;
  nombre: string;
}

type PostConContador = Post & { comentariosVisibles?: number };

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<PostConContador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postEditar, setPostEditar] = useState<PostConContador | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [postEliminarId, setPostEliminarId] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userId = user.id ?? user._id;
      if (!userId) {
        setError('ID de usuario no encontrado');
        setLoading(false);
        return;
      }

      try {
        const [postsRes, tagsRes] = await Promise.all([
          fetch(`${API_URL}/user/${userId}/post`),
          fetch(`${API_URL}/tag`)
        ]);

        if (!postsRes.ok || !tagsRes.ok) throw new Error('Error al obtener datos');

        const postsData: PostConContador[] = await postsRes.json();
        const tagsData: Tag[] = await tagsRes.json();

        setAvailableTags(tagsData);

        const postsTransformados = postsData.map((post) => {
          const etiquetasNombres = post.etiquetas.map(tag => {
            if (typeof tag === 'string') {
              const encontrado = tagsData.find(t => (t.id ?? t._id) === tag);
              return encontrado?.nombre || tag;
            }
            return tag.nombre || '';
          });

          return {
            ...post,
            _id: post._id ?? (post as any).id,
            etiquetas: etiquetasNombres
          };
        }).filter(post => !!post._id);

        setPosts(postsTransformados);
      } catch (err: any) {
        toast.error('No se pudieron obtener tus publicaciones', {
          description: err.message || 'Ocurrió un error inesperado.',
          action: {
            label: 'Reintentar',
            onClick: () => window.location.reload()
          }
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const manejarLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleModificarPost = (post: PostConContador) => {
    setPostEditar(post);
  };

  const confirmarEliminarPost = (postId: string) => {
    setPostEliminarId(postId);
  };

  const eliminarPostConfirmado = async () => {
    if (!postEliminarId) return;
    setEliminando(true);

    try {
      const res = await fetch(`${API_URL}/post/${postEliminarId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar el post');

      setPosts((prev) => prev.filter((p) => p._id !== postEliminarId));
      toast.success('Publicación eliminada correctamente');
      setPostEliminarId(null);
    } catch (err: any) {
      toast.error('No se pudo eliminar la publicación', {
        description: err.message || 'Ocurrió un error inesperado.',
      });
    } finally {
      setEliminando(false);
    }
  };

  const guardarPostEditado = async (actualizado: Partial<Post>) => {
    if (!postEditar) return;

    try {
      const res = await fetch(`${API_URL}/post/${postEditar._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();

      const etiquetasNombres = (data.post.etiquetas || []).map((id: string) => {
        const found = availableTags.find(tag => (tag.id ?? tag._id) === id);
        return found?.nombre || id;
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postEditar._id ? { ...p, ...data.post, etiquetas: etiquetasNombres } : p
        )
      );

      toast.success('Post actualizado correctamente');
      setPostEditar(null);
    } catch (err: any) {
      toast.error('No se pudo actualizar el post', {
        description: err.message || 'Ocurrió un error inesperado.',
      });
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <PageWrapper>
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
            key={post._id}
            post={post}
            cantidadComentarios={undefined}
            onModificar={() => handleModificarPost(post)}
            onEliminar={() => confirmarEliminarPost(post._id)}
          />
        ))}

        {postEditar && (
          <EditPostModal
            post={postEditar}
            onClose={() => setPostEditar(null)}
            onSave={guardarPostEditado}
          />
        )}

        <Modal show={!!postEliminarId} onHide={() => setPostEliminarId(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que querés eliminar esta publicación?</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setPostEliminarId(null)}
              disabled={eliminando}
            >
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={eliminarPostConfirmado}
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </PageWrapper>
  );
}
