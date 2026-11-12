import React, { useState } from 'react';
import { obtenerSerieDeTiempo } from '../services/dataService';
import TarjetaMetrica from './TarjetaMetrica';
import TablaDatos from './TablaDatos';

const PanelAnalitico = () => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ciudad, setCiudad] = useState('19.2647,-98.8975');

  const consultarApiExterna = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const [lat, lon] = ciudad.split(',');
      await new Promise((res) => setTimeout(res, 600));
      const resultado = await obtenerSerieDeTiempo(lat, lon);
      setDatos(resultado);
    } catch (err) {
      console.error('Error al conectar con la API de datos:', err);
      setError(
        err.response
          ? `Error del servidor (${err.response.status}): No se pudo procesar la serie de tiempo.`
          : 'Error de conexión: Verifica tu acceso a internet o la URL configurada en .env.local.'
      );
      setDatos(null);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ color: '#0f172a', fontSize: '1.4rem' }}>
          Integración con API Externa (Series de Tiempo)
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Consumo asíncrono mediante Axios con manejo de estados de carga y captura de excepciones.
        </p>
      </div>

      <form
        onSubmit={consultarApiExterna}
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          marginBottom: '1.5rem'
        }}
      >
        <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>
          Ubicación del Sensor:
        </label>
        <select
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem'
          }}
        >
          <option value="19.2647,-98.8975">Chalco, Estado de México</option>
          <option value="19.4326,-99.1332">Ciudad de México (CDMX)</option>
          <option value="25.6866,-100.3161">Monterrey, Nuevo León</option>
        </select>

        <button
          type="submit"
          disabled={cargando}
          style={{
            backgroundColor: cargando ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '0.55rem 1.25rem',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Consultando API...' : 'Consultar Serie de Tiempo'}
        </button>
      </form>

      {cargando && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '1rem'
          }}
        >
          ⏳ Analizando datos y descargando serie de tiempo desde la API externa...
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '8px',
            fontWeight: '500',
            marginBottom: '1rem'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {datos && !cargando && (
        <div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <TarjetaMetrica
              titulo="Muestras Analizadas"
              valor={datos.resumen.totalPuntos}
              descripcion="Intervalos horarios extraídos"
            />
            <TarjetaMetrica
              titulo="Temperatura Media"
              valor={datos.resumen.promedio}
              descripcion="Promedio de la serie temporal"
            />
            <TarjetaMetrica
              titulo="Pico Máximo"
              valor={datos.resumen.maximo}
              descripcion="Valor máximo detectado"
            />
          </div>

          <TablaDatos dataset={datos.registros} />
        </div>
      )}
    </section>
  );
};

export default PanelAnalitico;