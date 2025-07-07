import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/constants';
import { Comment } from '../types/mongoSchemas'; // Asegurate de tener este tipo
import { toast } from 'sonner';

interface Props {
  postId: string;
  onComentarioAgregado?: (comentario: Comment) => void;
}

export default function FormularioComentario({ postId, onComentarioAgregado }: Props) {
  const { user } = useAuth();
  const [comentario, setComentario] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim() || !user) return;

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido: comentario,
          post: postId,
          user: user._id || user.id,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el comentario');

      const resultado = await res.json();
      const nuevoComentario: Comment = {
        ...resultado,
        user: {
          _id: user._id || user.id,
          nickname: user.nickname,
        },
      };

      onComentarioAgregado?.(nuevoComentario);
      setComentario('');
    } catch (err) {
      toast.error('Error al enviar el comentarioe');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="mt-3">
      <textarea
        className="form-control"
        placeholder="Escribí tu comentario..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={cargando}
        required
      />
      <button className="btn btn-secondary mt-2" disabled={cargando}>
        {cargando ? 'Enviando...' : 'Agregar comentario'}
      </button>
    </form>
  );
}