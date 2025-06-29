import { Link } from 'react-router-dom';
import { Post, PostPopulated } from '../types/mongoSchemas';

type PostCardData = Post | PostPopulated;

interface PostCardProps {
  post: PostCardData;
}

export default function PostCard({ post }: PostCardProps) {
  const isPopulated = (p: PostCardData): p is PostPopulated =>
    Array.isArray(p.imagenes) && typeof p.imagenes[0] === 'object';

  const etiquetas = isPopulated(post)
    ? post.etiquetas.map((tag) => tag.nombre).join(', ')
    : post.etiquetas.length;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.descripcion}</h5>
        <p className="text-muted">Fecha: {post.fecha}</p>

        {/* Imágenes */}
        {isPopulated(post) ? (
          post.imagenes.map((img, i) => (
            <img key={i} src={img.url} className="img-fluid mb-2" alt={`Imagen ${i + 1}`} />
          ))
        ) : (
          <p>Imágenes: {post.imagenes.length}</p>
        )}

        {/* Etiquetas */}
        <p>Etiquetas: {etiquetas || 'Sin etiquetas'}</p>

        {/* Usuario */}
        {isPopulated(post) && (
          <p>Publicado por: {post.user.nickname} ({post.user.email})</p>
        )}

        {/* Comentarios */}
        {'comentarios' in post && (
          <p>{post.comentarios.length} comentario(s)</p>
        )}

        <Link to={`/post/${post._id}`} className="btn btn-primary">
          Ver más
        </Link>
      </div>
    </div>
  );
}
