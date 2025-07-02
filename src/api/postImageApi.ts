const API = import.meta.env.VITE_API_URL;

export const getPostImages = async () => {
  const res = await fetch(`${API}/postimages`);
  if (!res.ok) throw new Error("Error al obtener imágenes");
  return res.json();
};

export const createPostImage = async (url: string, postId: string) => {
  const res = await fetch(`${API}/postimages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, postId })
  });
  if (!res.ok) throw new Error("Error al crear imagen");
  return res.json();
};

export const updatePostImage = async (id: string, url: string) => {
  const res = await fetch(`${API}/postimages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error("Error al actualizar imagen");
  return res.json();
};

export const deletePostImage = async (id: string) => {
  const res = await fetch(`${API}/postimages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar imagen");
  return res.json();
};