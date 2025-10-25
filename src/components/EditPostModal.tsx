import { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { Post } from '../types/mongoSchemas';
import { API_URL } from '../config/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'sonner';

interface EditPostModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (updatedPost: Partial<Post>) => Promise<void>;
}

interface Tag {
  id: string;
  nombre: string;
}

export default function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [descripcion, setDescripcion] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!post) return;

      setDescripcion(post.descripcion || '');

      try {
        const response = await fetch(`${API_URL}/tag`);
        const tags: Tag[] = await response.json();
        setAvailableTags(tags);

        const etiquetasNombres = post.etiquetas
          .map(tag =>
            typeof tag === 'string'
              ? tags.find(t => t.id === tag)?.nombre || tag
              : tag.nombre || ''
          )
          .join(', ');

        setEtiquetas(etiquetasNombres);
      } catch (error) {
        toast.error('Error al cargar etiquetas');
      }
    };

    init();
  }, [post]);

  const handleSave = async () => {
    if (!post) return;

    const etiquetasArray = etiquetas
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const etiquetasIds: string[] = etiquetasArray
      .map(tagName => availableTags.find(t => t.nombre === tagName)?.id || null)
      .filter((id): id is string => id !== null);

    const etiquetasNoEncontradas = etiquetasArray.filter(
      tagName => !availableTags.find(t => t.nombre === tagName)
    );

    if (etiquetasNoEncontradas.length > 0) {
      toast.error(`Etiquetas no encontradas: ${etiquetasNoEncontradas.join(', ')}`);
      return;
    }

    // ✅ Normalizar imágenes a string[]
    const imagenesNormalizadas: string[] = (post.imagenes ?? []).map(img =>
      typeof img === 'string' ? img : img.url
    );

    const dataToSend: Partial<Post> = {
      descripcion,
      etiquetas: etiquetasIds,
      imagenes: imagenesNormalizadas, // ✅ corregido
    };

    try {
      setLoading(true);
      await onSave(dataToSend);
      onClose();
    } catch {
      toast.error('Error al actualizar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tagName: string) => {
    const currentTags = etiquetas.split(',').map(t => t.trim());
    if (!currentTags.includes(tagName)) {
      setEtiquetas([...currentTags, tagName].join(', '));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = etiquetas.split(',').map(t => t.trim());
    const newTags = currentTags.filter(t => t !== tagToRemove);
    setEtiquetas(newTags.join(', '));
  };

  return (
    <Modal show={!!post} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>✏ Editar Post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe la descripción del post..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Etiquetas (separadas por comas)</Form.Label>
          <Form.Control
            type="text"
            value={etiquetas}
            onChange={(e) => setEtiquetas(e.target.value)}
            placeholder="Arte, Tecnología, Naturaleza..."
          />
        </Form.Group>

        {availableTags.length > 0 && (
          <>
            <Form.Label>Etiquetas disponibles:</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {availableTags.map(tag => (
                <Badge
                  pill
                  bg="primary"
                  key={tag.id}
                  className="px-3 py-2 cursor-pointer"
                  onClick={() => handleAddTag(tag.nombre)}
                  style={{ cursor: 'pointer' }}
                >
                  {tag.nombre}
                </Badge>
              ))}
            </div>
          </>
        )}

        {etiquetas && (
          <>
            <Form.Label>Etiquetas actuales:</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {etiquetas
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
                .map(tag => (
                  <Badge
                    pill
                    bg="success"
                    key={tag}
                    className="px-3 py-2 d-flex align-items-center"
                  >
                    {tag}
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => handleRemoveTag(tag)}
                      className="ms-2 px-2 py-0"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Guardar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
