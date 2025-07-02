import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUsers } from '../api/userApi';

export default function Register() {
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await getUsers();
      const exists = user.some(u => u.nickname === nickname);
      if (exists) {
        alert('Ya existe ese nickname');
        return;
      }

      await createUser({ nickname, email, password });
      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleRegister} className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Registro</h2>

      <input
        placeholder="Nickname"
        value={nickname}
        onChange={e => setNickName(e.target.value)}
        className="form-control mb-2"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="form-control mb-2"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="form-control mb-2"
        required
      />

      <button type="submit" className="btn btn-success">Registrarse</button>
    </form>
  );
}
