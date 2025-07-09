import { Link } from 'react-router-dom';
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Nav } from 'react-bootstrap';

// Botón con animaciones framer-motion + Bootstrap
interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ children, className = "", ...props }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.15,
        boxShadow: "0px 0px 18px rgba(0, 255, 0, 0.8)",
      }}
      whileTap={{ scale: 0.95 }}
      className={`btn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Link de navegación con animación y Bootstrap
interface NavLinkAnimadoProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  to: string;
  style?: React.CSSProperties;
}

export function NavLinkAnimado({ children, onClick, className, to, style }: NavLinkAnimadoProps) {
  return (
    <motion.div
      whileHover={{
        scale: 0.85,
        border: "1px solid white",
        borderRadius: "8px",
        padding: "4px",
      }}
      style={{ display: "inline-block", ...style }}
    >
      <Nav.Link
        onClick={onClick}
        className={className}
        as={Link}
        to={to}
        style={{ cursor: "pointer" }}
      >
        {children}
      </Nav.Link>
    </motion.div>
  );
}
