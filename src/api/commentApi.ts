// Habilita tipado para import.meta.env.VITE_*
/// <reference types="vite/client" /> 
const API = import.meta.env.VITE_API_URL;

// Obtener todos los comentarios
export const getComments = async () => {
  const res = await fetch(`${API}/comments`);
  if (!res.ok) throw new Error('Error al obtener comentarios');
  return res.json();
};

// Crear un nuevo comentario
export const createComment = async (comment: {
  contenido: string;
  fecha?: string; // opcional
  user: string;   // id del usuario
  post: string;   // id del post
}) => {
  const res = await fetch(`${API}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error('Error al crear comentario');
  return res.json();
};

// Actualizar un comentario por ID
export const updateComment = async (id: string, data: {
  contenido: string;
  fecha?: string;
}) => {
  const res = await fetch(`${API}/comments/${id}`, {
    method: 'PUT', // o PATCH, ver en el back
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar comentario');
  return res.json();
};

// Eliminar un comentario por ID
export const deleteComment = async (id: string) => {
  const res = await fetch(`${API}/comments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar comentario');
  return res.json();
};