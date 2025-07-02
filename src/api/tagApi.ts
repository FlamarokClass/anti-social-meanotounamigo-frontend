const API = import.meta.env.VITE_API_URL;

export const getTags = async () => {
  const res = await fetch(`${API}/tags`);
  if (!res.ok) throw new Error("Error al obtener etiquetas");
  return res.json();
};

export const createTag = async (nombre: string) => {
  const res = await fetch(`${API}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre })
  });
  if (!res.ok) throw new Error("Error al crear etiqueta");
  return res.json();
};

export const updateTag = async (id: string, nombre: string) => {
  const res = await fetch(`${API}/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre })
  });
  if (!res.ok) throw new Error("Error al actualizar etiqueta");
  return res.json();
};

export const deleteTag = async (id: string) => {
  const res = await fetch(`${API}/tags/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar etiqueta");
  return res.json();
};