import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
          <Form className="mx-auto w-50 d-flex" onSubmit={e => e.preventDefault()}>
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2"
              aria-label="Buscar"
            />
            <Button variant="light">Buscar</Button>
          </Form>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/mi-perfil" className="text-white">Mi perfil</Nav.Link>
                <Nav.Link as={Link} to="/new" className="text-white">New Post</Nav.Link>
                <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: 'pointer' }}>
                  Log out ({user.nickname})
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}