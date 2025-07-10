import { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { Post } from '../types/mongoSchemas';
import { API_URL } from '../config/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'sonner';

interface EditPostModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>; 
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
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);

  useEffect(() => {
    const init = async () => {
      if (!post) return;

      setDescripcion(post.descripcion || '');

      const response = await fetch(`${API_URL}/tag`);
      const tags: Tag[] = await response.json();
      setAvailableTags(tags);

      const etiquetasNombres = post.etiquetas
        .map(tag => (typeof tag === 'string' ? tags.find(t => t.id === tag)?.nombre || tag : tag.nombre || ''))
        .join(', ');
      setEtiquetas(etiquetasNombres);

      const imagenesActuales = Array.isArray(post.imagenes)
        ? post.imagenes.map((img: any) => (typeof img === 'string' ? img : img.url))
        : [];
      setImagenes(imagenesActuales);
    };

    init();
  }, [post]);

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

  const eliminarImagenExistente = (url: string) => {
    setImagenes(prev => prev.filter(img => img !== url));
  };

  const handleNuevaImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNuevasImagenes([...nuevasImagenes, ...Array.from(e.target.files)]);
    }
  };

  const eliminarNuevaImagen = (index: number) => {
    setNuevasImagenes(prev => prev.filter((_, i) => i !== index));
  };

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

    const formData = new FormData();
    formData.append('descripcion', descripcion);
    etiquetasIds.forEach(id => formData.append('etiquetas[]', id));
    imagenes.forEach(url => formData.append('imagenesExistentes[]', url));
    nuevasImagenes.forEach(file => formData.append('imagenesNuevas', file));

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch {
      toast.error('Error al actualizar el post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={!!post} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>✏️ Editar Post</Modal.Title>
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
            <div className="d-flex flex-wrap gap-2 mb-3">
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

        <Form.Group className="mb-3">
          <Form.Label>Imágenes actuales:</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {imagenes.map((url, i) => (
              <div key={i} className="position-relative">
                <img
                  src={url}
                  alt={`img-${i}`}
                  className="img-thumbnail"
                  style={{ width: 100, height: 'auto' }}
                />
                <Button
                  size="sm"
                  variant="danger"
                  className="position-absolute top-0 end-0"
                  onClick={() => eliminarImagenExistente(url)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Agregar nuevas imágenes:</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={handleNuevaImagen} />
          {nuevasImagenes.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {nuevasImagenes.map((img, i) => (
                <div key={i} className="position-relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`new-img-${i}`}
                    className="img-thumbnail"
                    style={{ width: 100, height: 'auto' }}
                  />
                  <Button
                    size="sm"
                    variant="danger"
                    className="position-absolute top-0 end-0"
                    onClick={() => eliminarNuevaImagen(i)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form.Group>
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
