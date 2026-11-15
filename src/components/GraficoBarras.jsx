import React from 'react';

const GraficoBarras = ({ dataset }) => {
  const maxTemp =
    dataset && dataset.length > 0
      ? Math.max(...dataset.map((d) => d.temperaturaNumerica), 30)
      : 30;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
          Distribución Horaria de Temperatura (°C)
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Visualización sincronizada con los criterios activos del panel de filtros.
        </p>
      </div>

      {!dataset || dataset.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
          No hay registros que coincidan con el filtro seleccionado.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '1rem',
            height: '210px',
            paddingTop: '1.5rem',
            borderBottom: '2px solid #e2e8f0'
          }}
        >
          {dataset.map((item) => {
            const alturaPorcentaje = Math.max((item.temperaturaNumerica / maxTemp) * 100, 8);
            return (
              <div
                key={item.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '0.35rem'
                  }}
                >
                  {item.temperaturaNumerica}°
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${alturaPorcentaje}%`,
                    backgroundColor: item.estado === 'Óptimo' ? '#2563eb' : '#0ea5e9',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.35s ease'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}
                >
                  {item.horaCorta}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GraficoBarras;