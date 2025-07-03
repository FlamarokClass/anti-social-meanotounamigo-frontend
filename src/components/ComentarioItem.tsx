import { Comentario } from '../types/mongoSchemas';

interface Props {
  comentario: Comentario;
}

export default function ComentarioItem({ comentario }: Props) {
  const autor = comentario.user?.nickname || 'Usuario';
  const fecha = new Date(comentario.fecha).toLocaleDateString();

  return (
    <li className="list-group-item">
      <strong>{autor}:</strong> {comentario.contenido}
      <br />
      <small className="text-muted">{fecha}</small>
    </li>
  );
}