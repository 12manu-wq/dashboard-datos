import PanelAnalitico from './components/PanelAnalitico';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TarjetaMetrica from './components/TarjetaMetrica';
import TablaDatos from './components/TablaDatos';
import { obtenerDatosVisualizacion, procesarDatos } from './services/dataService';

function App() {
  const [datosTabla, setDatosTabla] = useState([]);
  const [metricas, setMetricas] = useState({
    totalModelos: 0,
    promedioPrecision: '0%',
    mejorPrecision: '0%'
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Llamada al servicio asíncrono al montar el componente
    obtenerDatosVisualizacion().then((datos) => {
      const { datosFormateados, metricas } = procesarDatos(datos);
      setDatosTabla(datosFormateados);
      setMetricas(metricas);
      setCargando(false);
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#0f172a', fontSize: '1.5rem' }}>Panel de Rendimiento de Modelos</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Consumo desacoplado mediante servicios modulares y renderizado dinámico con React Hooks.
          </p>
        </div>

        {/* Instancias del componente TarjetaMetrica */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <TarjetaMetrica
            titulo="Total de Modelos"
            valor={cargando ? '...' : metricas.totalModelos}
            descripcion="Modelos entrenados en la sesión"
          />
          <TarjetaMetrica
            titulo="Precisión Promedio"
            valor={cargando ? '...' : metricas.promedioPrecision}
            descripcion="Media aritmética de exactitud"
          />
          <TarjetaMetrica
            titulo="Mejor Rendimiento"
            valor={cargando ? '...' : metricas.mejorPrecision}
            descripcion="Récord máximo alcanzado"
          />
        </div>

        {/* Instancia del componente TablaDatos */}
        <TablaDatos dataset={datosTabla} />
        <PanelAnalitico/>
      </main>
    </div>
  );
}

export default App;