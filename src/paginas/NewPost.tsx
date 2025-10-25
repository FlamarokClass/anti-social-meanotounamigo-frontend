import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config/constants";
import { Tag } from '../types/mongoSchemas';
import { createTag } from '../api/tagApi';
import { createPost, uploadPostImage, assignImagesToPost } from '../api/postApi';
import { toast } from 'sonner';
import PageWrapper, { AnimatedButton } from '../components/Animated';

export default function NewPost() {
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [nuevoTag, setNuevoTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/tag`)
      .then(res => res.json())
      .then((data: Tag[]) => setTags(data))
      .catch(() => {
        toast.error("Error al obtener etiquetas");
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

    const etiquetasValidas = selectedTags.every(id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));
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
    } catch (error: any) {
      toast.error(`Error al crear post: ${error.message || error}`);
    }
  };

  return (
    <PageWrapper>
      <div className="container mt-4">
        <h2 className="mb-3 card-title">Nueva publicación</h2>
        <div className="card shadow-sm mb-4">
      <div className="card-body">
          <form onSubmit={manejarSubmit}>
            <textarea
              required
              className="form-control mb-2"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descripción"
            />
            <div className="mb-3">
              <label className="form-label">Etiquetas</label>
              <div className="d-flex flex-wrap gap-3 mb-2">
                {tags.map(tag => (
                  <div key={tag.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id!)}
                      onChange={() => {
                        setSelectedTags(prevSelected => {
                          const isSelected = prevSelected.includes(tag.id!);
                          if (isSelected) {
                            return prevSelected.filter(id => id !== tag.id);
                          } else {
                            return [...prevSelected, tag.id!];
                          }
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                      {tag.nombre}
                    </label>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nueva etiqueta"
                  value={nuevoTag}
                  onChange={e => setNuevoTag(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={async () => {
                    const nombre = nuevoTag.trim();
                    if (!nombre) {
                      toast.warning("La etiqueta no puede estar vacía");
                      return;
                    }
                    const nombreConHash = nombre.startsWith('#') ? nombre : '#' + nombre;
                    const yaExiste = tags.some(t => t.nombre.toLowerCase() === nombreConHash.toLowerCase());
                    if (yaExiste) {
                      toast.warning("Esa etiqueta ya existe");
                      return;
                    }
                    try {
                      const nueva = await createTag(nombreConHash);
                      setTags(prev => [...prev, nueva]);
                      setSelectedTags(prev => [...prev, nueva.id]);
                      setNuevoTag('');
                      toast.success("Etiqueta creada");
                    } catch {
                      toast.error("Error al crear etiqueta");
                    }
                  }}
                >
                  Crear
                </button>
              </div>
            </div>

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
       </div>
      </div>
    </PageWrapper>
  );
}