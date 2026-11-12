import React from 'react';

const TarjetaMetrica = ({ titulo, valor, descripcion }) => {
  const estilos = {
    tarjeta: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.25rem',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      flex: '1',
      minWidth: '220px',
      borderLeft: '4px solid #2563eb'
    },
    titulo: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem'
    },
    valor: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#0f172a'
    },
    descripcion: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      marginTop: '0.35rem'
    }
  };

  return (
    <div style={estilos.tarjeta}>
      <div style={estilos.titulo}>{titulo}</div>
      <div style={estilos.valor}>{valor}</div>
      {descripcion && <div style={estilos.descripcion}>{descripcion}</div>}
    </div>
  );
};

export default TarjetaMetrica;