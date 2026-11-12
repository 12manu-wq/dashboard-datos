import React from 'react';

const TablaDatos = ({ dataset }) => {
  const estilos = {
    contenedor: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      marginTop: '1.5rem',
      overflowX: 'auto' 
    },
    tabla: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      fontSize: '0.9rem'
    },
    th: {
      backgroundColor: '#f8fafc',
      color: '#475569',
      padding: '0.75rem 1rem',
      borderBottom: '2px solid #e2e8f0',
      fontWeight: '600'
    },
    td: {
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155'
    },
    badge: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '0.2rem 0.6rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Registro de Modelos Evaluados</h3>
      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.th}>ID</th>
            <th style={estilos.th}>Modelo</th>
            <th style={estilos.th}>Precisión (Accuracy)</th>
            <th style={estilos.th}>Pérdida (Loss)</th>
            <th style={estilos.th}>Muestras</th>
            <th style={estilos.th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {dataset && dataset.length > 0 ? (
            dataset.map((fila) => (
              <tr key={fila.id}>
                <td style={estilos.td}>{fila.id}</td>
                <td style={{ ...estilos.td, fontWeight: '500' }}>{fila.modelo}</td>
                <td style={estilos.td}>{fila.precisionPorcentaje}</td>
                <td style={estilos.td}>{fila.perdidaFormateada}</td>
                <td style={estilos.td}>{fila.registros.toLocaleString()}</td>
                <td style={estilos.td}>
                  <span style={estilos.badge}>{fila.estado}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ ...estilos.td, textAlign: 'center', color: '#94a3b8' }}>
                Cargando datos del servicio...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDatos;