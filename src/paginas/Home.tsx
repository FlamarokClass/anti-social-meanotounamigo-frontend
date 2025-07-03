import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types/mongoSchemas';
import { getPosts } from '../api/postApi';

export default function Home() {
  type PostConContador = Post & { comentariosVisibles?: number };
  const [posts, setPosts] = useState<PostConContador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPosts()
      .then((data: Post[]) => setPosts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const ahora = new Date();
  const publicacionesRecientes = posts.filter((post) => {
    const fechaPost = new Date(post.fecha);
    const diferenciaHoras = (ahora.getTime() - fechaPost.getTime()) / (1000 * 60 * 60); // logica para que en el home solo aparezcan las publicaciones dentro de las 24hs
    return diferenciaHoras <= 24;
  });

  return (
    <div className="container py-4">
      <section className="text-center bg-light p-5 rounded shadow mb-4">
        <h1 className="display-4">Bienvenid@ a UnaHur Anti-Social Net</h1>
        <p className="lead">La red social donde lo antisocial está de moda 😎</p>
      </section>

      <section className="mb-5">
        <h2>Sobre Nosotros</h2>
        <p>
          Somos estudiantes comprometidos en desarrollar una red social
          descentralizada, sin filtros, sin algoritmo y sin miedo.
        </p>
      </section>

      <section className="mb-5">
        <h2>Slogans & Curiosidades</h2>
        <ul>
          <li>🧠 “Publicar sin filtros, pensar sin censura”</li>
          <li>📚 Más de 200 posts ya publicados</li>
          <li>🤫 Nadie te obliga a dar like, ni siquiera hay botón</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3">Publicaciones recientes</h2>

        {loading && <p>Cargando publicaciones...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && publicacionesRecientes.length === 0 && (
          <p className="text-muted">No hay publicaciones en las últimas 24 horas.</p>
        )}

        {publicacionesRecientes.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            cantidadComentarios={post.comentariosVisibles}
          />
    ))}
      </section>
    </div>
  );
}