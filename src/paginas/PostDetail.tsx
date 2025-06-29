import { Post, PostPopulated } from '../types/mongoSchemas';

type PostFlexible = Post | PostPopulated;

interface Props {
  post: PostFlexible;
}

export default function PostDetalleFlexible({ post }: Props) {
  const isPopulated = (p: PostFlexible): p is PostPopulated =>
    Array.isArray(p.imagenes) && typeof p.imagenes[0] === 'object';

  const imagenes = isPopulated(post)
    ? post.imagenes
    : []; // en caso de ser solo IDs no se pueden mostrar

  const etiquetas = isPopulated(post)
    ? post.etiquetas.map(e => e.nombre)
    : post.etiquetas;

  const comentarios = isPopulated(post) ? post.comentarios : [];

  const autor = isPopulated(post) ? post.user.nickname : '';

  return (
    <div className="container mt-4">
      <h2>{post.descripcion}</h2>
      <p><strong>Fecha:</strong> {post.fecha}</p>
      {autor && <p><strong>Autor:</strong> {autor}</p>}

      <div className="mb-3">
        {imagenes.map((img, i) => (
          <img key={i} src={img.url} alt={`Imagen ${i + 1}`} className="img-fluid mb-2" />
        ))}
      </div>

      <p><strong>Etiquetas:</strong> {etiquetas.join(', ')}</p>

      {comentarios.length > 0 && (
        <>
          <h4>Comentarios:</h4>
          <ul>
            {comentarios.map((c) => (
              <li key={c._id}>
                <strong>{c.user.nickname}</strong>: {c.contenido}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
