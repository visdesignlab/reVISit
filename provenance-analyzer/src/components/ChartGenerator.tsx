import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 650;
const svgHeight = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = "#eb6a5b";
const green = "#b6e86f";
const blue = "#52b6ca";
const colors = chroma.scale([blue, green, red]).mode("hsl");
interface IChartGenerator {
  data: number[];
}

const ChartGenerator = ({ data }: IChartGenerator) => {
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  // not won't update on prop change, only on state change.

  let margin = { left: 20, top: 20, right: 20, bottom: 20 },
    width = svgWidth - margin.right - margin.left,
    height = svgHeight - margin.top - margin.bottom,
    xScale = d3.scaleLinear().range([margin.left, width - margin.right]),
    yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]),
    colorScale = d3.scaleLinear();

  // set domains
  const tempMax = d3.max(data);
  const colorDomain = d3.extent(data);
  xScale.domain([0, data.length]);
  yScale.domain([0, tempMax]);
  colorScale.domain(colorDomain);

  let xAxis = d3.axisBottom().scale(xScale),
    yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat((d) => `${d}℉`);

  const bars = data.map((d, i) => {
    const y1 = yScale(d);
    const y2 = yScale(0);
    return {
      x: xScale(i),
      y: y1,
      height: y2 - y1,
      fill: colors(colorScale(d)),
    };
  });

  // use a "useEffect hook" when you want to append stuff to the svg
  // using d3. Refs can be used to add axes.
  useEffect(() => {
    d3.select(xAxisRef.current).call(xAxis);
    d3.select(yAxisRef.current).call(yAxis);
  }, []);

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {bars.map((d, i) => {
          return (
            <rect
              key={i}
              x={d.x}
              y={d.y}
              width="10"
              height={d.height}
              fill={d.fill}
            />
          );
        })}
        <g>
          <g
            ref={xAxisRef}
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        </g>
      </g>
    </svg>
  );
};

export default ChartGenerator;
