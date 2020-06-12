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
            x={x(index) - xBand.bandwidth() * 0.9} // 1/2 xBandwidth to move to middle 1/2 another because of -1 index on xBand domain
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

const BrushableHistogram = ({ data, xScale, setMinimum, setMaximum }) => {
  const width = xScale.range()[1];
  const height = 30;
  const scale = xScale;
  console.log("width dywootto;", xScale.range(), xScale.domain());

  function setFilterBounds(inputs) {
    // scale inversion
    setMinimum(scale.invert(inputs[0]));
    // set bounds
    setMaximum(scale.invert(inputs[1]));
  }

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

const TimeFilter = ({ data, xScale, columnDef, onFilterChanged }) => {
  const [minimum, setMinimum] = useState(d3.min(data));
  const [maximum, setMaximum] = useState(d3.max(data));
  const debouncedMin = useDebounce(minimum, 100);
  const debouncedMax = useDebounce(maximum, 100);
  useEffect(() => {
    onFilterChanged(columnDef.tableData.id, [debouncedMin, debouncedMax]);
  }, [debouncedMin, debouncedMax]);
  return (
    <BrushableHistogram
      xScale={xScale}
      data={data}
      setMinimum={setMinimum}
      setMaximum={setMaximum}></BrushableHistogram>
  );
};
export default TimeFilter;

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
