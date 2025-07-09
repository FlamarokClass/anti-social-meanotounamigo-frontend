import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import Home from '../src/paginas/Home';
import Login from '../src/paginas/Login';
import Register from '../src/paginas/Register';
import Perfil from './paginas/Perfil';
import NewPost from '../src/paginas/NewPost';
import PostDetail from '../src/paginas/PostDetail';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  // Estado para modo oscuro
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className={darkMode ? 'bg-dark text-white' : ''} style={{ minHeight: '100vh' }}>
      <Toaster richColors position="top-center" />
      
      
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

 
      <main
        style={{
          paddingTop: '70px',
          minHeight: 'calc(100vh - 140px)',
          backgroundColor: darkMode ? '#5e5e5e' : '#f8f9fa',
          color: darkMode ? 'white' : 'black'
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mi-perfil" element={user ? <Perfil /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/new" element={user ? <NewPost /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>


      <Footer darkMode={darkMode} />
    </div>
  );
}