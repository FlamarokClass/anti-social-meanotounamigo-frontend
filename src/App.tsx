import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/Navbar'; 
import Footer from '../src/components/Footer';



// Importar páginas
import Home from '../src/paginas/Home';
import Login from '../src/paginas/Login';
import Register from '../src/paginas/Register';
import Perfil from './paginas/Perfil';
import NewPost from '../src/paginas/NewPost';
import PostDetail from '../src/paginas/PostDetail';

import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main style={{ paddingTop: '70px', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/perfil"
            element={user ? <Perfil /> : <Navigate to="/login" />}
          />
          <Route
            path="/new"
            element={user ? <NewPost /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}