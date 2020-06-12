import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { select, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { brushX } from "d3-brush";
import { axisBottom } from "d3-axis";

export const Histogram = ({ data, width, height }) => {
  const binner = d3.histogram();
  const buckets = binner(data);

  // the scale
  let x = d3.scaleLinear().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  let xBand = d3
    .scaleBand()
    .domain(d3.range(-1, buckets.length))
    .range([0, width]);

  x.domain([-1, buckets.length]);
  y.domain([0, d3.max(buckets, (bucket) => bucket.length)]);
  console.log(buckets, x);
  const bars = (
    <g>
      {buckets.map((bucket, index) => {
        return (
          <rect
            key={index}
            x={x(index) - (xBand.bandwidth() * 0.9) / 2}
            y={y(bucket.length)}
            width={xBand.bandwidth() * 0.9}
            height={height - y(bucket.length)}></rect>
        );
      })}
    </g>
  );

  return bars;
};

const Brush = (props) => {
  console.log(props);
  const width = props.width;
  const scale = props.scale;
  const height = props.height;
  const brushRef = useRef(null);
  const onBrushFunction = props.onChange;
  //const width = props.width;
  //const scale = scaleLinear().domain([0, 30]).range([0, width]);
  useEffect(() => {
    const node = brushRef.current;

    const dayBrush = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("brush", brushed);
    //const dayAxis = axisBottom().scale(scale);

    select(node)
      .selectAll("g.brushaxis")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brushaxis")
      .attr("transform", "translate(0,25)");

    //select(node).select("g.brushaxis").call(dayAxis);

    select(node)
      .selectAll("g.brush")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brush");

    select(node).select("g.brush").call(dayBrush);

    function brushed() {
      console.log(event);
      onBrushFunction(event.selection);
    }
  });
  return (
    <svg ref={brushRef} width={width} height={50}>
      {props.children}
    </svg>
  );
};

const BrushableHistogram = ({ data, setBounds }) => {
  const initMin = d3.min(data);
  const initMax = d3.max(data);
  const width = 50;
  const height = 30;
  const scale = scaleLinear().domain([initMin, initMax]).range([0, width]);

  const [minimum, setMinimum] = useState(initMin);
  const [maximum, setMaximum] = useState(initMax);

  function setFilterBounds(inputs) {
    // scale inversion
    setMinimum(scale.invert(inputs[0]));
    // set bounds
    setMaximum(scale.invert(inputs[1]));
  }
  console.log(minimum);
  console.log(maximum);
  return (
    <Brush
      width={width}
      height={height}
      scale={scale}
      onChange={setFilterBounds}>
      <Histogram
        data={data}
        width={width}
        height={height}
        scale={scale}></Histogram>
    </Brush>
  );
};

const TimeFilter = 
export default BrushableHistogram;
