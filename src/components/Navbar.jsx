import React from 'react';
const Navbar = () => {
  const estilos = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    titulo: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    alumno: {
      fontSize: '0.95rem',
      color: '#94a3b8'
    }
  };

  return (
    <nav style={estilos.nav}>
      <h1 style={estilos.titulo}>Dashboard de Ciencia de Datos</h1>
      <span style={estilos.alumno}>Alumno: JOSE MANUEL GORGONIO ESPINOZA</span>
    </nav>
  );
};

export default Navbar;