// Habilita tipado para import.meta.env.VITE_*
/// <reference types="vite/client" /> 
const API = import.meta.env.VITE_API_URL;

export const getPosts = async () => {
  const res = await fetch(`${API}/post`);
  if (!res.ok) throw new Error("Error al obtener posts");
  return res.json();
};

export const createPost = async (post: {
  descripcion: string;
  etiquetas: string[];
  user: string;
}) => {
  const res = await fetch(`${API}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error("Error al crear post");
  return res.json();
};

export const updatePost = async (id: string, data: any) => {
  const res = await fetch(`${API}/post/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar post");
  return res.json();
};

export const deletePost = async (id: string) => {
  const res = await fetch(`${API}/post/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Error al eliminar post");
  return res.json();
};