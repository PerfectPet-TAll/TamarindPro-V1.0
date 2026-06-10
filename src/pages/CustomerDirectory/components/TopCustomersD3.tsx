import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TopCustomerData {
  name: string;
  score: number;
  kpi1: string; // e.g. Revenue
  kpi2: string; // e.g. Orders
}

interface LeaderboardProps {
  data: TopCustomerData[];
}

export const TopCustomersD3: React.FC<LeaderboardProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const width = chartRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 160 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(' '))
      .style('max-width', '100%')
      .style('height', 'auto');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.score) || 100])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale);

    // Add X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g.selectAll('.tick line').attr('stroke', '#adb2b0').attr('stroke-dasharray', '2,2')
      )
      .call((g) =>
        g.selectAll('.tick text').attr('fill', '#8c7361').attr('font-size', '10px').attr('font-family', 'JetBrains Mono').attr('font-weight', 'bold')
      );

    // Add Y Axis
    g.append('g')
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) =>
        g.selectAll('.tick text').attr('fill', '#2e3118').attr('font-size', '11px').attr('font-family', 'JetBrains Mono').attr('font-weight', 'bold')
      );

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => yScale(d.name)!)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', 0) // Start at 0 for animation
      .attr('fill', '#f47729')
      .attr('rx', 4)
      .transition()
      .duration(1000)
      .attr('width', (d) => xScale(d.score));

    // Value Labels
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('y', (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr('x', 5) // Start at 5 for animation
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-weight', 'bold')
      .text((d) => d.score)
      .transition()
      .duration(1000)
      .attr('x', (d) => xScale(d.score) - 25);

    // KPI Labels
    g.selectAll('.kpi-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'kpi-label')
      .attr('y', (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr('x', innerWidth + 10)
      .attr('dy', '0.35em')
      .attr('fill', '#8c7361')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .text((d) => `${d.kpi1} | ${d.kpi2}`)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

  }, [data]);

  return <div ref={chartRef} className="w-full h-full min-h-[300px]" />;
};
