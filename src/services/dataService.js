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

export const obtenerSerieDeTiempo = async (latitud = 19.2647, longitud = -98.8975) => {
  const respuesta = await apiClient.get('/forecast', {
    params: {
      latitude: latitud,
      longitude: longitud,
      hourly: 'temperature_2m,relative_humidity_2m',
      forecast_days: 1
    }
  });

  const { time, temperature_2m, relative_humidity_2m } = respuesta.data.hourly;

  const registrosLimpios = time.slice(0, 8).map((hora, index) => ({
    id: index + 1,
    modelo: `Sensor Horario (${hora.split('T')[1]} hrs)`,
    precisionPorcentaje: `${temperature_2m[index]} °C`,
    perdidaFormateada: `${relative_humidity_2m[index]} %`,
    registros: Math.round(temperature_2m[index] * 100),
    estado: temperature_2m[index] > 20 ? 'Óptimo' : 'Estable'
  }));

  const temps = temperature_2m.slice(0, 8);
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