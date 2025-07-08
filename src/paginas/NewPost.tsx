import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/constants";
import { Tag } from '../types/mongoSchemas';
import { createPost } from '../api/postApi';
import { toast } from 'sonner';
import { AnimatedButton } from '../components/Animated';

export default function NewPost() {
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // obtener etiquetas del backend
  useEffect(() => {
    fetch(`${API_URL}/tag`)
      .then(res => res.json())
      .then((data: Tag[]) => setTags(data))
      .catch(err => {
        toast.error("Error al obtener etiquetas:", err);
        toast.error("No se pudieron cargar las etiquetas");
      });
  }, []);

  // manejar submit del formulario
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validar que el usuario este autenticado
    const userId = user?._id || user?.id;
    if (!user || !userId) {
      toast.warning("Error: el usuario no está autenticado correctamente.");
      navigate('/login');
      return;
    }

    // validar que las etiquetas sean validas
    const etiquetasValidas = selectedTags.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (!etiquetasValidas) {
      toast.warning("Alguna de las etiquetas seleccionadas no es válida.");
      return;
    }

    // crear el post
    try {
      await createPost({
        descripcion,
        etiquetas: selectedTags,
        user: userId,
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error("Error al crear el post:", error.message);
      toast.error(`Hubo un error al crear la publicación: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nueva publicación</h2>
      <form onSubmit={manejarSubmit}>
        <textarea
          required
          className="form-control mb-2"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />

        <select
          multiple
          className="form-control mb-2"
          onChange={e =>
            setSelectedTags([...e.target.selectedOptions].map(o => o.value))
          }
        >
          {tags.map((tag, i) => (
            <option key={i} value={tag['id']}>
              {tag.nombre}
            </option>
          ))}
        </select>

      <AnimatedButton type="submit" className="btn-success">
        Publicar
      </AnimatedButton>
      </form>
    </div>
  );
}