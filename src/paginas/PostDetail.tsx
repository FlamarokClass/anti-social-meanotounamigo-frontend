import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from "../config/constants";

type Image = { url: string };
type Comment = { content: string };
type Post = {
  description: string;
  images?: Image[];
  tags?: string[];
  comments?: Comment[];
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');

  // Cargar post
  const cargarPost = () => {
    fetch(`${API_URL}/posts/${id}`)
      .then(res => res.json())
      .then(setPost);
  };

  useEffect(() => {
    cargarPost();
  }, [id]);

  const manejarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment, postId: id }),
    });

    setComment('');
    cargarPost(); // recarga el post con los nuevos comentarios sin recargar la página
  };

  if (!post) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>{post.description}</h2>
      {post.images?.map((img, i) => (
        <img key={i} src={img.url} alt={`imagen-${i + 1}`} className="img-fluid mb-2" />
      ))}
      <p>Etiquetas: {post.tags?.join(', ')}</p>
      <h4>Comentarios:</h4>
      <ul>
        {post.comments?.map((c, i) => (
          <li key={i}>{c.content}</li>
        ))}
      </ul>
      <form onSubmit={manejarComentario} className="mt-3">
        <textarea
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button className="btn btn-success">Agregar comentario</button>
      </form>
    </div>
  );
}