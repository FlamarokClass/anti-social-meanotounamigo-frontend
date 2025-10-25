import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLinkAnimado, AnimatedButton } from "./Animated"; 
import { toast } from "sonner";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); 

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Sesión cerrada correctamente.");
  };

  const confirmarLogout = () => {
    toast.custom((t) => (
      <div style={{ minWidth: 220, padding: 8, background: '#333', color: '#fff', borderRadius: 8 }}>
        <strong>¿Estás seguro que querés cerrar sesión?</strong>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              toast.dismiss((t as any).id);
              handleLogout();
              setExpanded(false); 
            }}
          >
            Sí, cerrar sesión
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded} 
      onToggle={() => setExpanded(!expanded)} 
      style={{ backgroundColor: darkMode ? "#541161" : "#008000" }}
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
            <Button
              variant={darkMode ? "light" : "dark"}
              onClick={toggleDarkMode}
              title="Cambiar modo oscuro"
              className="me-2"
            >
              <i
                className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-stars-fill"}`}
              ></i>
            </Button>

            <NavLinkAnimado to="/" className="text-white" onClick={() => setExpanded(false)}>
              <i className="bi bi-house-door"></i> Inicio
            </NavLinkAnimado>

            {user ? (
              <>
                <NavLinkAnimado to="/mi-perfil" className="text-white" onClick={() => setExpanded(false)}>
                  <i className="bi bi-person-check"></i> Mi perfil
                </NavLinkAnimado>

                <NavLinkAnimado to="/new" className="text-white" onClick={() => setExpanded(false)}>
                  <i className="bi bi-chat-left-text"></i> Nuevo post
                </NavLinkAnimado>

                <AnimatedButton
                  className="btn btn-link text-white p-0 d-flex align-items-center gap-1"
                  onClick={() => confirmarLogout()}
                  style={{ textDecoration: "none" }}
                >
                  <i className="bi bi-door-closed"></i> Cerrar ({user.nickname})
                </AnimatedButton>
              </>
            ) : (
              <>
                <NavLinkAnimado to="/login" className="text-white" onClick={() => setExpanded(false)}>
                  <i className="bi bi-door-open"></i> Ingresar
                </NavLinkAnimado>

                <NavLinkAnimado to="/register" className="text-white" onClick={() => setExpanded(false)}>
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