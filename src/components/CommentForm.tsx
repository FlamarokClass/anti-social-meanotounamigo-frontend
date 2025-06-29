import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/constants';

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido: comment,
          post: postId,
          user: user?._id, // opcional si requerido por backend
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el comentario');

      setComment('');
      onCommentAdded?.(); // callback para actualizar comentarios
    } catch (err) {
      alert('Error al enviar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        className="form-control"
        placeholder="Escribí tu comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button className="btn btn-secondary mt-2" disabled={loading}>
        {loading ? 'Enviando...' : 'Agregar comentario'}
      </button>
    </form>
  );
}
