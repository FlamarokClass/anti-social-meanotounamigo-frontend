import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef  } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
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
        boxShadow: "0px 0px 18px rgb(241, 5, 5)",
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
        border: "1px solid white",
        borderRadius: "8px",
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

// Transición de las páginas
export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

//  Widget del clima con barra de carga animada
export function ClimaWidgetConBarra() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const widgetDiv = document.createElement("div");
    widgetDiv.id = "ww_02e056f70dfbc";
    widgetDiv.setAttribute("v", "1.3");
    widgetDiv.setAttribute("loc", "auto");
    widgetDiv.setAttribute(
      "a",
      '{"t":"ticker","lang":"es","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#0288D1","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#FFFFFF","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'
    );
    widgetDiv.innerHTML =
      'Más previsiones: <a href="https://oneweather.org/es/seville/" id="ww_02e056f70dfbc_u" target="_blank" rel="noreferrer" style="color:white; text-decoration:underline;">Clima en Sevilla</a>';

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://app3.weatherwidget.org/js/?id=ww_02e056f70dfbc";
    script.async = true;
    document.body.appendChild(script);

    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
      document.body.removeChild(script);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 60,
        backgroundColor: "#0288D1",
        borderRadius: 8,
        padding: "12px 16px",
        color: "white",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgb(2, 137, 209)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: 3,
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <small style={{ marginTop: 8, fontWeight: "bold" }}>
              Cargando clima...
            </small>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} />
    </div>
  );
}
