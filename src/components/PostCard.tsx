import { Link } from 'react-router-dom';
import { Post } from '../types/mongoSchemas';
import { AnimatedButton } from '../components/Animated';

interface Props {
  post: Post;
  cantidadComentarios?: number;
  onModificar?: () => void;
  onEliminar?: () => void;
}

export default function PostCard({
  post,
  cantidadComentarios,
  onModificar,
  onEliminar
}: Props) {
  const etiquetas = Array.isArray(post.etiquetas)
    ? post.etiquetas.map((e) =>
        typeof e === 'string' ? e : e.nombre
      )
    : [];

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{post.descripcion}</h5>

        <p className="card-text">
          <strong>Fecha:</strong> {post.fecha}
        </p>

        <p className="card-text">
          <strong>Etiquetas:</strong>{' '}
          {etiquetas.length > 0
            ? etiquetas.join(', ')
            : <span className="text-muted">(sin etiquetas)</span>}
        </p>

        {typeof cantidadComentarios === 'number' && (
          <p className="card-text">
            <strong>Comentarios:</strong>{' '}
            {cantidadComentarios > 0
              ? `${cantidadComentarios} comentario(s)`
              : <span className="text-muted">(ninguno visible)</span>}
          </p>
        )}
        
        <div className="d-flex gap-2 flex-wrap mt-3">
          <Link to={`/post/${post._id}`} className="btn btn-primary">
            Ver más
          </Link>

          {onModificar && (
            <AnimatedButton className="btn btn-warning" onClick={onModificar}>
              Modificar
            </AnimatedButton>
          )}

          {onEliminar && (
            <AnimatedButton className="btn btn-danger" onClick={onModificar}>
              Eliminar
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
}
