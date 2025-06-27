import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: comment })
      });
      setComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
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