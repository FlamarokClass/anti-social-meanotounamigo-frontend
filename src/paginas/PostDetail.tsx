import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostPopulated } from '../types/mongoSchemas';
import PostDetalleFlexible from '../components/PostDetalleFlexible';
import { API_URL } from '../config/constants';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<PostPopulated | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/post/${id}/full`)
      .then((res) => {
        if (!res.ok) throw new Error('Publicación no encontrada');
        return res.json();
      })
      .then((data: PostPopulated) => {
        setPost(data);
      })
      .catch((err) => {
        console.error('Error al cargar detalle:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container mt-4">Cargando publicación...</p>;
  if (error) return <p className="container mt-4 text-danger">Error: {error}</p>;
  if (!post) return <p className="container mt-4">No se encontró el post</p>;

  return <PostDetalleFlexible post={post} />;
}