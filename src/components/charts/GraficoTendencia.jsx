import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const GraficoTendencia = ({ datosGrafico }) => {
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
      .scalePoint()
      .domain(puntos.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.25);

    const maxVal = d3.max(puntos, (d) => d.value) || 30;
    const minVal = d3.min(puntos, (d) => d.value) || 0;

    const yScale = d3
      .scaleLinear()
      .domain([Math.max(0, minVal - 3), maxVal + 3])
      .nice()
      .range([innerHeight, 0]);

    // Líneas guía horizontales
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(''))
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3,3');
    g.selectAll('.domain').remove();

    // Ejes X e Y
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}°`))
      .selectAll('text')
      .style('fill', '#475569')
      .style('font-size', '11px');

    // Línea de tendencia continua
    const linea = d3
      .line()
      .x((d) => xScale(d.label))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const path = g
      .append('path')
      .datum(puntos)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', linea);

    // Animación de trazado de línea
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Puntos interactivos con Tooltip
    g.selectAll('.punto-tendencia')
      .data(puntos)
      .enter()
      .append('circle')
      .attr('class', 'punto-tendencia')
      .attr('cx', (d) => xScale(d.label))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 6)
      .attr('fill', '#1d4ed8')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('r', 8.5).attr('fill', '#0284c7');
        setTooltip({
          x: xScale(d.label) + margin.left,
          y: yScale(d.value) + margin.top,
          label: d.label,
          value: `${d.value} °C`,
          estado: d.estado
        });
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('r', 6).attr('fill', '#1d4ed8');
        setTooltip(null);
      });
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
        Tendencia Térmica Continua (D3.js Line)
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
        Pasa el cursor sobre cada nodo para inspeccionar temperatura y estado.
      </p>

      {!datosGrafico || datosGrafico.puntos.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2.5rem 0' }}>
          Sin registros disponibles para trazar tendencia.
        </p>
      ) : (
        <div style={{ position: 'relative' }}>
          <svg ref={svgRef} />
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(Math.max(tooltip.x - 55, 8), 380)}px`,
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
              <strong>{tooltip.label} hrs</strong>: {tooltip.value} ({tooltip.estado})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraficoTendencia;