import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/constants";
import { Tag } from '../types/mongoSchemas';
import { toast } from 'sonner';
import { createPost, uploadPostImage, assignImagesToPost } from '../api/postApi';
import PageWrapper, { AnimatedButton } from '../components/Animated';

export default function NewPost() {
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/tag`)
      .then(res => res.json())
      .then((data: Tag[]) => setTags(data))
      .catch(err => {
        toast.error("Error al obtener etiquetas:", err);
        toast.error("No se pudieron cargar las etiquetas");
      });
  }, []);
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = user?._id || user?.id;
    if (!user || !userId) {
      toast.warning("Error: el usuario no está autenticado correctamente.");
      navigate('/login');
      return;
    }

    const etiquetasValidas = selectedTags.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (!etiquetasValidas) {
      toast.warning("Alguna de las etiquetas seleccionadas no es válida.");
      return;
    }

    try {
          const newPost = await createPost({
            descripcion,
            etiquetas: selectedTags,
            user: userId,
          });
          if (files.length > 0) {
            const uploadedIds: string[] = [];
            for (const file of files) {
              const { image } = await uploadPostImage(file);
              uploadedIds.push(image.id!);
            }
            await assignImagesToPost(newPost.id, uploadedIds);
          }
          toast.success("Post creado con éxito");
          navigate('/profile');
        }
    catch (error: any) {
          toast.error(`Error al crear post: ${error.message || error}`);
        }
      };

  return (
    <PageWrapper>
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
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="imageUpload" className="form-label">Seleccionar imágenes</label>
          <input
            id="imageUpload"
            type="file"
            className="form-control mb-2"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
          />
          
        <AnimatedButton type="submit" className="btn-success">
          Publicar
        </AnimatedButton>
        </form>
      </div>
    </PageWrapper>
  );
}