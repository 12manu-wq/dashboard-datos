import datasetLocal from '../data/dataset.json';
import apiClient from './apiClient';

export const obtenerDatosVisualizacion = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(datasetLocal);
    }, 400);
  });
};

export const procesarDatos = (datos) => {
  if (!datos || datos.length === 0) {
    return {
      datosFormateados: [],
      metricas: { totalModelos: 0, promedioPrecision: '0%', mejorPrecision: '0%' }
    };
  }

  const datosFormateados = datos.map((item) => ({
    ...item,
    precisionPorcentaje: `${(item.precision * 100).toFixed(1)}%`,
    perdidaFormateada: item.perdida.toFixed(2)
  }));

  const total = datos.length;
  const sumaPrecision = datos.reduce((acc, curr) => acc + curr.precision, 0);
  const promedioPrecision = ((sumaPrecision / total) * 100).toFixed(1) + '%';
  const mejorPrecision = (Math.max(...datos.map((d) => d.precision)) * 100).toFixed(1) + '%';

  return {
    datosFormateados,
    metricas: {
      totalModelos: total,
      promedioPrecision,
      mejorPrecision
    }
  };
};

// --- FUNCIÓN CON SOPORTE DE FILTROS INTERACTIVOS (PRÁCTICA 3.4) ---
export const obtenerSerieDeTiempo = async (filtros = {}) => {
  const region = filtros.region || '19.2647,-98.8975';
  const [latitud, longitud] = region.split(',');

  const parametros = {
    latitude: latitud,
    longitude: longitud,
    hourly: 'temperature_2m,relative_humidity_2m',
    timezone: 'auto'
  };

  // Si el usuario seleccionó una fecha específica, se consulta ese día exacto
  if (filtros.fecha) {
    parametros.start_date = filtros.fecha;
    parametros.end_date = filtros.fecha;
  } else {
    parametros.forecast_days = 1;
  }

  const respuesta = await apiClient.get('/forecast', { params: parametros });
  const { time, temperature_2m, relative_humidity_2m } = respuesta.data.hourly;

  // Muestreo cada 3 horas (8 puntos a lo largo del día)
  const indices = [0, 3, 6, 9, 12, 15, 18, 21];
  let registrosLimpios = indices
    .filter((idx) => time[idx] !== undefined)
    .map((idx, i) => {
      const temp = temperature_2m[idx];
      const hora = time[idx].split('T')[1];
      return {
        id: i + 1,
        modelo: `Lectura (${hora} hrs)`,
        horaCorta: hora,
        temperaturaNumerica: temp,
        precisionPorcentaje: `${temp} °C`,
        perdidaFormateada: `${relative_humidity_2m[idx]} %`,
        registros: Math.round(temp * 100),
        estado: temp > 18 ? 'Óptimo' : 'Estable'
      };
    });

  // Aplicar filtro por categoría de estado si está activo
  if (filtros.estado && filtros.estado !== 'todos') {
    registrosLimpios = registrosLimpios.filter((r) => r.estado === filtros.estado);
  }

  if (registrosLimpios.length === 0) {
    return {
      registros: [],
      resumen: { totalPuntos: 0, promedio: '0.0 °C', maximo: '0.0 °C' }
    };
  }

  const temps = registrosLimpios.map((r) => r.temperaturaNumerica);
  const tempPromedio = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) + ' °C';
  const tempMax = Math.max(...temps).toFixed(1) + ' °C';

  return {
    registros: registrosLimpios,
    resumen: {
      totalPuntos: registrosLimpios.length,
      promedio: tempPromedio,
      maximo: tempMax
    }
  };
};