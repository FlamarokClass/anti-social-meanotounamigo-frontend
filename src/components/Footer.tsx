import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>
        {`
          .hover-link:hover {
            color: white !important;
            text-decoration: underline !important;
          }
        `}
      </style>
      <footer
        style={{
          backgroundColor: darkMode ? '#541161' : '#008000',
          color: 'white',
        }}
        className="py-4 mt-5"
      >
        <Container>
          <Row>
            <Col md={4} className="mb-3">
              <h5 className="mb-3">
                <i className="bi bi-people-fill me-2"></i>
                AntiSocialRed
              </h5>
              <p className="mb-0">
                La red social donde lo antisocial está de moda. 
                Sin filtros, sin algoritmo, sin miedo.
              </p>
            </Col>

            <Col md={4} className="mb-3">
              <h5 className="mb-3">Enlaces</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white-50 text-decoration-none hover-link">Inicio</Link></li>
                <li><Link to="/login" className="text-white-50 text-decoration-none hover-link">Ingresar</Link></li>
                <li><Link to="/register" className="text-white-50 text-decoration-none hover-link">Registrar</Link></li>
                <li><Link to="/new" className="text-white-50 text-decoration-none hover-link">Nuevo post</Link></li>
              </ul>
            </Col>

            <Col md={4} className="mb-3">
              <h5 className="mb-3">Contacto</h5>
              <p className="mb-1">
                <i className="bi bi-envelope me-2"></i>
                info@antisocialred.com
              </p>
              <p className="mb-1">
                <i className="bi bi-geo-alt me-2"></i>
                Universidad Nacional de Hurlingham
              </p>
              <div className="mt-3">
                <a href="#" className="text-white me-3" style={{ fontSize: '1.2rem' }}>
                  <i className="bi bi-github"></i>
                </a>
                <a href="#" className="text-white me-3" style={{ fontSize: '1.2rem' }}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-white" style={{ fontSize: '1.2rem' }}>
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </Col>
          </Row>

          <hr className="border-white-50 my-4" />

          <Row>
            <Col md={6}>
              <p className="mb-0 text-white-50">
                &copy; {currentYear} AntiSocialRed. Todos los derechos reservados.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-0 text-white-50">
                Desarrollado por estudiantes de UnaHur
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}