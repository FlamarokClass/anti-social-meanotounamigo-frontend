import { Link } from 'react-router-dom';

interface Image {
  url: string;
}

interface PostCardProps {
  post: {
    _id: string;
    description: string;
    tags?: string[];
    images?: Image[];
    comments?: { content: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.description}</h5>
        {post.images?.map((img, i) => (
          <img key={i} src={img.url} className="img-fluid mb-2" alt={`Imagen ${i + 1}`} />
        ))}
        <p>Etiquetas: {post.tags?.join(', ')}</p>
        <p>{post.comments?.length || 0} comentarios</p>
        <Link to={`/post/${post._id}`} className="btn btn-primary">Ver más</Link>
      </div>
    </div>
  );
}