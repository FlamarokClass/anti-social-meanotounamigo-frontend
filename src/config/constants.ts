// Habilita tipado para import.meta.env.VITE_*
/// <reference types="vite/client" />

export const API_URL = import.meta.env.VITE_API_URL;

// Validación opcional (recomendado)
if (!API_URL) throw new Error("VITE_API_URL no está definida");