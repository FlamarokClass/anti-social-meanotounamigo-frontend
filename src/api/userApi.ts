// Habilita tipado para import.meta.env.VITE_*
/// <reference types="vite/client" /> 
const API = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
  const res = await fetch(`${API}/user`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const createUser = async (usuario: { nickname: string, email: string, password: string }) => {
  const res = await fetch(`${API}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

export const getUserByIdWithPosts = async (id: string) => {
  const res = await fetch(`${API}/user/${id}/post`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json(); 
}
