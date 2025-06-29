import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';

export default function Register() {
  const [nickname, setNickname] = useState('');
  const navegar = useNavigate();

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Obtener usuarios actuales para validar (solo si es un ejercicio)
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const exists = users.some((u: any) => u.nickname === nickname);

    if (exists) {
      alert('Ya existe ese nickname');
      return;
    }

    // 2. Enviar al backend con los campos necesarios
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname,
        email: `${nickname}@fake.com`, // Email simulado
        followers: [],
        following: []
      }),
    });

    navegar('/login');
  };

  return (
    <form onSubmit={manejarRegistro} className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Registro</h2>
      <input
        placeholder="nickname"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        className="form-control mb-2"
        required
      />
      <button type="submit" className="btn btn-success">
        Registrarse
      </button>
    </form>
  );
}
