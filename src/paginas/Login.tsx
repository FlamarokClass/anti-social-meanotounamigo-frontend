import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Usuario falso hardcodeado
  const fakeUser = { _id: '1', nickName: 'testuser' };
  const fakePassword = '123456';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (nickName === fakeUser.nickName && password === fakePassword) {
      setUser(fakeUser);
      localStorage.setItem('user', JSON.stringify(fakeUser));
      navigate('/');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleLogin} className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <input
        placeholder="nickName"
        value={nickName}
        onChange={(e) => setNickName(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-success">
        Ingresar
      </button>
      <p className="mt-3 text-muted">
        Usuario: <b>testuser</b> / Contraseña: <b>123456</b>
      </p>
    </form>
  );
}