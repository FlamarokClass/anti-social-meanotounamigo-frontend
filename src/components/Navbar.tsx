import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLinkAnimado } from './Animated';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: darkMode ? '#08014a' : '#008000' }}
      variant="dark"
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-people-fill fs-4 me-2 text-white"></i>
          <span className="fs-5">AntiSocialRed</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-2">

            {/* Botón de modo oscuro */}
            <Button
              variant={darkMode ? 'light' : 'dark'}
              onClick={toggleDarkMode}
              title="Cambiar modo oscuro"
              className="me-2"
            >
              <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
            </Button>

            <NavLinkAnimado to="/" className="text-white">
              <i className="bi bi-house-door"></i> Inicio
            </NavLinkAnimado>

            {user ? (
              <>
                <NavLinkAnimado to="/mi-perfil" className="text-white">
                  <i className="bi bi-person-check"></i> Mi perfil
                </NavLinkAnimado>

                <NavLinkAnimado to="/new" className="text-white">
                  <i className="bi bi-chat-left-text"></i> Nuevo post
                </NavLinkAnimado>

                <NavLinkAnimado onClick={handleLogout} className="text-white">
                  <i className="bi bi-door-closed"></i> Cerrar ({user.nickname})
                </NavLinkAnimado>
              </>
            ) : (
              <>
                <NavLinkAnimado to="/login" className="text-white">
                  <i className="bi bi-door-open"></i> Ingresar
                </NavLinkAnimado>

                <NavLinkAnimado to="/register" className="text-white">
                  <i className="bi bi-pen"></i> Registrar
                </NavLinkAnimado>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}