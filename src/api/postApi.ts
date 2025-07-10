// Habilita tipado para import.meta.env.VITE_*
/// <reference types="vite/client" /> 
const API = import.meta.env.VITE_API_URL;
import { PostImage } from '../types/mongoSchemas'
import { UpdatePostParams } from '../types/mongoSchemas'

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
export const uploadPostImage = async (file: File): Promise<{ image: PostImage }> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API}/post-image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir imagen");
  return res.json();
};

export const deleteImagesFromPost = async (postId: string, imageIds: string[]) => {
  const res = await fetch(`${API}/post/${postId}/images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageIds }),
  });

  if (!res.ok) throw new Error("Error al eliminar imágenes del post");
  return res.json();
};

export const getAllPostImages = async (): Promise<PostImage[]> => {
  const res = await fetch(`${API}/post-image`);
  if (!res.ok) throw new Error("Error al obtener imágenes");
  return res.json();
};
export const assignImagesToPost = async (postId: string, imageIds: string[]) => {
  const res = await fetch(`${API}/post/${postId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageIds }),
  });

  if (!res.ok) throw new Error("Error al asignar imágenes al post");
  return res.json();
};

