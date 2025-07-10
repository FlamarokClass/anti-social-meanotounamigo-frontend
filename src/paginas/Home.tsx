import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types/mongoSchemas';
import { getPosts } from '../api/postApi';
import PageWrapper, { ClimaWidgetConBarra } from '../components/Animated';

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
    const diferenciaHoras = (ahora.getTime() - fechaPost.getTime()) / (1000 * 60 * 60);
    return diferenciaHoras <= 24;
  });

  return (
    <PageWrapper> 
      <div className="px-4 py-4">
        <section className="text-center mb-4">
          <ClimaWidgetConBarra />
          <img
            src="portada.png" 
            alt="Banner Anti-Social"
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </section>

 <section className="mb-5">
          <h2 className="fs-2">Sobre Nosotros</h2>
          <p className="fs-4">
            Somos estudiantes comprometidos en desarrollar una red social
            descentralizada, sin filtros, sin algoritmo y sin miedo.
          </p>
        </section>

        <section className="mb-5"> {/*ESTO CAMBIÉ */}
          <h2>¿Quiénes somos?</h2>
          <ul className="fs-4">
            <li>👨‍🎓 Anderson Rojas, Franco Leonel.</li>
            <li>👨‍🎓 Britos, Alexis Franco.</li>
            <li>👩‍🎓 Denhoff, Lorena Soledad.</li>
            <li>👨‍🎓 Garcia, Oscar Osvaldo.</li>
            <li>👨‍🎓 Paz, Facundo Leonel.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2>¿Qué te ofrecemos?</h2>
          <ul className="fs-4">
            <li>🚫 Una red social que no es social.</li>
            <li>🧨 Anti-todo. Incluso nosotros.</li>
            <li>😶 Red antisocial: porque estar solo también está bueno.</li>
            <li>🤖❌ Sin algoritmos. Sin presión. Sin drama.</li>
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
    </PageWrapper>
  );
}