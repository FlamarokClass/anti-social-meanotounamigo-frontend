import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLinkAnimado } from "./Animated";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#008000' }} variant="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-people-fill fs-4 me-2 text-white"></i>
          <span className="fs-5">AntiSocialRed</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">
            <i className="bi bi-house-door"></i>Inicio</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/mi-perfil" className="text-white">
                <i className="bi bi-person-check"></i>Mi perfil</Nav.Link>

                <Nav.Link as={Link} to="/new" className="text-white">
                <i className="bi bi-chat-left-text"></i>Nuevo post</Nav.Link>

                <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-door-closed"></i>Cerrar ({user.nickname})</Nav.Link>
              </>
            ) : (
              <>
              <NavLinkAnimado to="/login" className="text-white">
               <i className="bi bi-door-open"></i> Ingresar
              </NavLinkAnimado>

                <Nav.Link as={Link} to="/register" className="text-white">
                <i className="bi bi-pen"></i>Registrar</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}