import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import PanelFiltros from './components/PanelFiltros';
import TarjetaMetrica from './components/TarjetaMetrica';
import GraficoTendencia from './components/charts/GraficoTendencia';
import GraficoComparativo from './components/charts/GraficoComparativo';
import TablaDatos from './components/TablaDatos';
import { obtenerSerieDeTiempo, formatearParaGrafico } from './services/dataService';

function App() {
  const [filtros, setFiltros] = useState({
    region: '19.2647,-98.8975',
    fecha: '',
    estado: 'todos'
  });

  const [datos, setDatos] = useState({
    registros: [],
    resumen: { totalPuntos: 0, promedio: '0.0 °C', maximo: '0.0 °C' }
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    const actualizarDashboard = async () => {
      setCargando(true);
      setError(null);
      try {
        const resultado = await obtenerSerieDeTiempo(filtros);
        if (activo) {
          setDatos(resultado);
        }
      } catch (err) {
        if (activo) {
          setError('No se pudieron cargar los datos para la fecha o región seleccionada.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    actualizarDashboard();

    return () => {
      activo = false;
    };
  }, [filtros]);

  // Transformación de datos crudos para los componentes D3.js
  const datosGraficos = formatearParaGrafico(datos.registros);

  return (
    <DashboardLayout
      header={<Navbar />}
      sidebar={<PanelFiltros filtros={filtros} setFiltros={setFiltros} />}
    >
      <div>
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          Dashboard Interactivo con Visualización Avanzada (D3.js)
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Gráficos SVG responsivos sincronizados en tiempo real con el panel de filtros globales.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '8px',
            fontWeight: '500'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Fila superior: Tarjetas de Métricas */}
      <div className="metrics-grid">
        <TarjetaMetrica
          titulo="Muestras Filtradas"
          valor={cargando ? '...' : datos.resumen.totalPuntos}
          descripcion="Registros activos en el periodo"
        />
        <TarjetaMetrica
          titulo="Temperatura Promedio"
          valor={cargando ? '...' : datos.resumen.promedio}
          descripcion="Media calculada en tiempo real"
        />
        <TarjetaMetrica
          titulo="Temperatura Máxima"
          valor={cargando ? '...' : datos.resumen.maximo}
          descripcion="Pico registrado según filtros"
        />
      </div>

      {/* Sección central: Dos gráficos D3.js sincronizados */}
      <div className="charts-grid">
        <GraficoTendencia datosGrafico={datosGraficos} />
        <GraficoComparativo datosGrafico={datosGraficos} />
      </div>

      {/* Sección inferior: Tabla de detalles */}
      <TablaDatos dataset={datos.registros} />
    </DashboardLayout>
  );
}

export default App;