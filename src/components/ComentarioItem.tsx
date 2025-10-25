import { useState } from 'react';
import { CommentPopulated } from '../types/mongoSchemas';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/constants';
import { toast } from 'sonner';

interface Props {
  comentario: CommentPopulated;
  onEditar: (comentarioEditado: CommentPopulated) => void;
  onEliminar: (idComentario: string) => void;
}

export default function ComentarioItem({ comentario, onEditar, onEliminar }: Props) {
  const { user } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState(comentario.contenido);
  const [cargando, setCargando] = useState(false);

  const puedeEditar = user && user.id === comentario.user.id;

  const guardarEdicion = async () => {
    if (!nuevoContenido.trim()) return;

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/comment/${comentario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: nuevoContenido }),
      });

      if (!res.ok) throw new Error('Error al actualizar el comentario');

      const comentarioActualizado: CommentPopulated = {
        ...comentario,
        contenido: nuevoContenido,
        fecha: new Date().toISOString(),
      };

      onEditar(comentarioActualizado);
      setEditando(false);
      toast.success('Comentario actualizado correctamente');
      
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      toast.error('Error al actualizar el comentario');
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/comment/${comentario.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar el comentario');

      onEliminar(comentario.id!);
      toast.success('Comentario eliminado correctamente');
      
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      toast.error('Error al eliminar el comentario');
    } finally {
      setCargando(false);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setNuevoContenido(comentario.contenido);
  };

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <strong>{comentario.user.nickname || 'Usuario'}</strong>
          <small className="text-muted ms-2">
            {new Date(comentario.fecha).toLocaleDateString()}
          </small>
          
          {editando ? (
            <div className="mt-2">
              <textarea
                className="form-control"
                value={nuevoContenido}
                onChange={(e) => setNuevoContenido(e.target.value)}
                disabled={cargando}
                rows={3}
              />
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={guardarEdicion}
                  disabled={cargando || !nuevoContenido.trim()}
                >
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={cancelarEdicion}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 mb-1">{comentario.contenido}</p>
          )}
        </div>

        {puedeEditar && !editando && (
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setEditando(true)}
              disabled={cargando}
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={eliminar}
              disabled={cargando}
            >
              {cargando ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}