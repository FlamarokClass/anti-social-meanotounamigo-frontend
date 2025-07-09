import { useState } from 'react';
import { CommentPopulated } from '../types/mongoSchemas';
import { API_URL } from '../config/constants';

interface Props {
  comentario: CommentPopulated;
  userId?: string;
  onEditar: (comentarioEditado: CommentPopulated) => void;
  onEliminar: (idComentario: string) => void;
}

export default function ComentarioItem({ comentario, userId, onEditar, onEliminar }: Props) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [contenidoEditado, setContenidoEditado] = useState(comentario.contenido);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autor = comentario.user?.nickname || 'Usuario';
  const fecha = new Date(comentario.fecha).toLocaleDateString();

  const esAutor = userId === comentario.user?._id;

  const guardarEdicion = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/comentario/${comentario._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: contenidoEditado }),
      });
      if (!res.ok) throw new Error('Error al editar el comentario');
      const actualizado: CommentPopulated = await res.json();
      onEditar(actualizado);
      setModoEdicion(false);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar este comentario?')) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/comentario/${comentario._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar el comentario');
      onEliminar(comentario._id!);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="list-group-item">
      <strong>{autor}:</strong>{' '}
      {modoEdicion ? (
        <>
          <textarea
            className="form-control mb-2"
            value={contenidoEditado}
            onChange={(e) => setContenidoEditado(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-danger mb-2">{error}</div>}
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={guardarEdicion}
            disabled={loading || contenidoEditado.trim() === ''}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setModoEdicion(false);
              setContenidoEditado(comentario.contenido);
              setError(null);
            }}
            disabled={loading}
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          {comentario.contenido}
          <br />
          <small className="text-muted">{fecha}</small>
          {esAutor && (
            <div className="mt-2">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setModoEdicion(true)} disabled={loading}>
                Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={eliminar} disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          )}
          {error && <div className="text-danger mt-2">{error}</div>}
        </>
      )}
    </li>
  );
}
