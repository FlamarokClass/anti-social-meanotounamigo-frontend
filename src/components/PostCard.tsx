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
  onModificar,
  onEliminar
}: Props) {
  const etiquetas = Array.isArray(post.etiquetas)
    ? post.etiquetas
        .map((e) => {
          if (typeof e === 'string') {
            const esIdMongo = /^[a-f\d]{24}$/i.test(e);
            return esIdMongo ? null : e;
          }
          return e.nombre;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{post.descripcion}</h5>
        {Array.isArray(post.imagenes) && post.imagenes.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {post.imagenes.map((img, i) => {
              const url = typeof img === 'string' ? img : img.url;
              return (
                url && (<img key={i} src={url} alt={`Imagen ${i + 1}`} className="img-thumbnail" style={{ maxWidth: '150px', height: 'auto' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/errorImg.jpg';
                }}
                />)
              );
            })}
        </div>
        )}
        <p className="card-text">
          <strong>Fecha:</strong> {post.fecha}
        </p>

        <p className="card-text">
          <strong>Etiquetas:</strong>{' '}
          {etiquetas.length > 0 ? etiquetas.join(', ') : <span className="text-muted">(sin etiquetas)</span>}
        </p>

        <p className="card-text text-secondary mt-2">
          💬 Hacé clic en <strong>"Ver más"</strong> para ver los comentarios
        </p>

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
            <AnimatedButton className="btn btn-danger" onClick={onEliminar}>
              Eliminar
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
}
