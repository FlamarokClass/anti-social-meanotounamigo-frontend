import { useState } from 'react';
import { PostPopulated, CommentPopulated } from '../types/mongoSchemas';
import ComentarioItem from './ComentarioItem';
import FormularioComentario from './FormularioComentario';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/Animated';

interface Props {
  post: PostPopulated;
}

export default function PostDetalleFlexible({ post }: Props) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<CommentPopulated[]>(post.comentarios ?? []);
  const etiquetas = post.etiquetas.map((e) => e.nombre);

  const agregarComentario = (nuevoComentario: CommentPopulated) => {
    setComentarios([...comentarios, nuevoComentario]);
  };

  const editarComentario = (comentarioEditado: CommentPopulated) => {
    setComentarios(comentarios.map(c => c._id === comentarioEditado._id ? comentarioEditado : c));
  };

  const eliminarComentario = (idComentario: string) => {
    setComentarios(comentarios.filter(c => c._id !== idComentario));
  };

  return (
    <PageWrapper>
      <div className="container mt-4">
        <h2 className="mb-3">Detalle de Publicación</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">{post.descripcion}</h5>
            {Array.isArray(post.imagenes) && post.imagenes.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-2">
                {post.imagenes.map((img, i) => {
                  const url = typeof img === 'string' ? img : img.url;
                  return (
                    url && (
                      <img
                        key={i}
                        src={url}
                        alt={`Imagen ${i + 1}`}
                        className="img-thumbnail"
                        style={{ maxWidth: '600px', height: 'auto' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/errorImg.jpg';
                        }}
                      />
                    )
                  );
                })}
              </div>
            )}
            <p><strong>Fecha:</strong> {post.fecha}</p>
            <p>
              <strong>Etiquetas:</strong>{' '}
              {etiquetas.length > 0
                ? etiquetas.join(', ')
                : <span className="text-muted">(sin etiquetas)</span>}
            </p>
          </div>
        </div>

        <h5 className="mb-3">Comentarios</h5>

        {comentarios.length > 0 ? (
          <ul className="list-group mb-4">
            {comentarios.map((comentario) => (
              <ComentarioItem
                key={comentario._id || Math.random()}
                comentario={comentario}
                userId={user?._id}
                onEditar={editarComentario}
                onEliminar={eliminarComentario}
              />
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-4">Este post aún no tiene comentarios visibles.</p>
        )}

        {user && (
          <FormularioComentario postId={post._id!} onComentarioAgregado={agregarComentario} />
        )}
      </div>
    </PageWrapper>
  );
}
