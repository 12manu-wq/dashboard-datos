import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const GraficoComparativo = ({ datosGrafico }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!datosGrafico || !datosGrafico.puntos || datosGrafico.puntos.length === 0) {
      return;
    }

    const puntos = datosGrafico.puntos;
    const width = 560;
    const height = 270;
    const margin = { top: 25, right: 25, bottom: 40, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(puntos.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.32);

    const maxHumedad = d3.max(puntos, (d) => d.humedad) || 100;

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(100, maxHumedad)])
      .nice()
      .range([innerHeight, 0]);

    // Ejes X e Y
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}%`))
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-size', '11px');

    // Barras comparativas animadas
    g.selectAll('.barra-comparativa')
      .data(puntos)
      .enter()
      .append('rect')
      .attr('class', 'barra-comparativa')
      .attr('x', (d) => xScale(d.label))
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 5)
      .attr('fill', (d) => (d.estado === 'Óptimo' ? '#0ea5e9' : '#6366f1'))
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('opacity', 0.8);
        setTooltip({
          x: xScale(d.label) + xScale.bandwidth() / 2 + margin.left,
          y: yScale(d.humedad) + margin.top,
          label: d.label,
          humedad: `${d.humedad}%`,
          temp: `${d.value} °C`
        });
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('opacity', 1);
        setTooltip(null);
      })
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.humedad))
      .attr('height', (d) => innerHeight - yScale(d.humedad));
  }, [datosGrafico]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        position: 'relative'
      }}
    >
      <h3 style={{ color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
        Comparativa de Humedad Relativa (D3.js Bar)
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
        Proporción porcentual por intervalo horario con inspección interactiva.
      </p>

      {!datosGrafico || datosGrafico.puntos.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2.5rem 0' }}>
          Sin registros disponibles para comparar proporciones.
        </p>
      ) : (
        <div style={{ position: 'relative' }}>
          <svg ref={svgRef} />
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(Math.max(tooltip.x - 65, 8), 360)}px`,
                top: `${Math.max(tooltip.y - 54, 4)}px`,
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                pointerEvents: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                zIndex: 20,
                whiteSpace: 'nowrap'
              }}
            >
              <strong>{tooltip.label} hrs</strong>: Humedad {tooltip.humedad} | Temp {tooltip.temp}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraficoComparativo;