import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nickName, setNickName] = useState('');
  const navegar = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.VITE_API_URL}/users`);
    const users = await res.json();
    const exists = users.some(u => u.nickName === nickName);
    if (exists) return alert('Ya existe ese nickName');

    await fetch(`${process.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickName })
    });

    navegar('/login');
  };

  return (
    <form onSubmit={manejarRegistro} className="container mt-5">
      <h2>Registro</h2>
      <input placeholder="nickName" value={nickName} onChange={e => setNickName(e.target.value)} className="form-control mb-2" />
      <button type="submit" className="btn btn-success">Registrarse</button>
    </form>
  );
}