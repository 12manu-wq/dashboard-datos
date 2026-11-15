import React from 'react';

const PanelFiltros = ({ filtros, setFiltros }) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const reiniciarFiltros = () => {
    setFiltros({
      region: '19.2647,-98.8975',
      fecha: '',
      estado: 'todos'
    });
  };

  const estiloInput = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    backgroundColor: '#f8fafc',
    marginTop: '0.35rem'
  };

  return (
    <div>
      <h3 style={{ color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
        Filtros Interactivos
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        Actualiza métricas, gráfica y tabla en tiempo real.
      </p>

      {/* Control 1: Selector de Región / Categoría */}
      <div style={{ marginBottom: '1.1rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
          Región de Monitoreo:
        </label>
        <select
          name="region"
          value={filtros.region}
          onChange={manejarCambio}
          style={estiloInput}
        >
          <option value="19.2647,-98.8975">Chalco, Estado de México</option>
          <option value="19.4326,-99.1332">Ciudad de México (CDMX)</option>
          <option value="25.6866,-100.3161">Monterrey, Nuevo León</option>
          <option value="20.6597,-103.3496">Guadalajara, Jalisco</option>
        </select>
      </div>

      {/* Control 2: Selector de Fecha */}
      <div style={{ marginBottom: '1.1rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
          Fecha de Consulta:
        </label>
        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={manejarCambio}
          style={estiloInput}
        />
      </div>

      {/* Control 3: Filtro por Categoría de Estado */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
          Condición Térmica:
        </label>
        <select
          name="estado"
          value={filtros.estado}
          onChange={manejarCambio}
          style={estiloInput}
        >
          <option value="todos">Todas las lecturas</option>
          <option value="Óptimo">Óptimo (&gt; 18 °C)</option>
          <option value="Estable">Estable (&le; 18 °C)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={reiniciarFiltros}
        style={{
          width: '100%',
          padding: '0.6rem',
          backgroundColor: '#e2e8f0',
          color: '#1e293b',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer'
        }}
      >
        Restablecer Filtros
      </button>
    </div>
  );
};

export default PanelFiltros;