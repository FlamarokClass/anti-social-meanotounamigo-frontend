import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUsers } from '../api/userApi';
import { toast } from 'sonner';
import { AnimatedButton } from '../components/Animated';
import PageWrapper from '../components/Animated';

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
        toast.error('Ya existe ese nickname');
        return;
      }

      await createUser({ nickname, email, password });
      toast.success('Usuario registrado con éxito');
      navigate('/login');
    } catch (error) {
      toast.error('Error al registrar usuario:', error);
    }
  };

  return (
    <PageWrapper>
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

        <AnimatedButton type="submit" className="btn-success">
          Registrarse
        </AnimatedButton>
      </form>
    </PageWrapper>
  );
}
