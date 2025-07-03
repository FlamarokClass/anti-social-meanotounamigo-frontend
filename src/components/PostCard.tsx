import { Link } from 'react-router-dom';
import { Post } from '../types/mongoSchemas';

interface Props {
  post: Post;
  cantidadComentarios?: number;
}

export default function PostCard({ post, cantidadComentarios }: Props) {
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

        <Link to={`/post/${post.id || post._id}`} className="btn btn-primary">
          Ver más
        </Link>
      </div>
    </div>
  );
}