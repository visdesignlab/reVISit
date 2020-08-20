import React, { useState, useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { select, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { brushX } from "d3-brush";
import { axisBottom } from "d3-axis";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

function obtainItemCounts(arr) {
  let occurrences = {};
  for (let i = 0, j = arr.length; i < j; i++) {
    occurrences[arr[i]] = (occurrences[arr[i]] || 0) + 1;
  }
  return occurrences;
}
export const CategoricalFilter = (props) => {
  const { data, width, scale, labels, onFilter = () => {} } = props;
  const occurrences = useMemo(() => obtainItemCounts(data), [data]);
  // search through data for all states
  const [currentFilter, setCurrentFilterInternal] = useState(
    Object.keys(occurrences)
  );
  const height = 20;
  const fullHeight = 20 + 15;
  const maxOccurance = Object.values(occurrences).reduce((a, b) =>
    a > b ? a : b
  );
  const yScale = d3.scaleLinear().domain([0, maxOccurance]).range([0, height]);
  function setCurrentFilter(currentValues) {
    console.log(currentValues);
    onFilter(currentValues);
    setCurrentFilterInternal(currentValues);
  }
  return (
    <svg width={width} height={fullHeight}>
      {Object.entries(occurrences).map(([key, value], index) => {
        const color = currentFilter.includes(key) ? "black" : "#cfcfcf";
        return (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title={key}
            key={key}
            PopperProps={{
              popperOptions: {
                modifiers: {
                  offset: {
                    enabled: true,
                    offset: "0px, -6px",
                  },
                },
              },
            }}>
            <g
              pointerEvents={"bounding-box"}
              key={key}
              onClick={() => {
                const indexOfValue = currentFilter.indexOf(key);
                let temp = Object.assign([], currentFilter);

                if (indexOfValue > -1) {
                  temp.splice(indexOfValue, 1);
                } else {
                  temp.push(key);
                }
                setCurrentFilter(temp);
              }}
              cursor={"pointer"}
              fill={"none"}>
              <rect
                x={scale(key)}
                width={20}
                height={yScale(value)}
                y={height - yScale(value)}
                fill={color}></rect>

              <g transform={`translate(${scale(key)},${height})`} fill={color}>
                {labels[key]}
              </g>
            </g>
          </Tooltip>
        );
      })}
    </svg>
  );
};

export const Histogram = ({ data, xScale, buckets, yScale, height }) => {
  console.log("hist props", data, xScale, buckets, yScale, height);
  const binWidth = 10;
  const [min, max] = xScale.domain();
  const currentBinCounter = d3
    .histogram()
    .domain([min - 0.001, max + 0.001]) // to make inclusive of threshold
    .thresholds(buckets.map((bucket) => bucket.x1));

  const currentBins = currentBinCounter(data);

  const bars = (
    <g transform={`translate(${(1 / 3) * binWidth},0)`}>
      {buckets.map((bucket, index) => {
        console.log(
          index,
          currentBins,
          currentBins[index],
          yScale(currentBins[index].length),
          yScale(0),
          yScale(250)
        );
        return (
          <g>
            <rect
              key={index}
              x={xScale(bucket.x0) - 0.5 * binWidth} // 1/2 xBandwidth to move to middle 1/2 another because of -1 index on xBand domain
              y={yScale(bucket.length)}
              width={binWidth}
              fill={"gray"}
              opacity={0.3}
              height={height - yScale(bucket.length)}></rect>
            <rect
              key={index}
              x={xScale(bucket.x0) - 0.5 * binWidth} // 1/2 xBandwidth to move to middle 1/2 another because of -1 index on xBand domain
              y={yScale(currentBins[index].length)}
              width={binWidth}
              fill={"black"}
              height={height - yScale(currentBins[index].length)}></rect>
          </g>
        );
      })}
    </g>
  );

  return bars;
};

const Brush = (props) => {
  const { width, height, onChange } = props;
  const brushRef = useRef(null);

  useEffect(() => {
    const node = brushRef.current;

    const dayBrush = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      //.on("brush", brushed)
      .on("end", brushed);

    select(node)
      .selectAll("g.brush")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brush");

    select(node).select("g.brush").call(dayBrush);

    /*
    Code for updating brush if we want it to dynamically update while brushing
    function brushed() {
      console.warn(event);
      onBrushFunction(event.selection);
    }*/
    function brushed() {
      // if filter cleared, set to all
      if (!event.selection) {
        event.selection = [0, width];
      }
      console.warn("clear", event);
      onChange(event.selection);
    }
  });
  return (
    <svg ref={brushRef} height={height} width={width}>
      {props.children}
    </svg>
  );
};

const BrushableHistogram = ({
  data,
  xScale,
  buckets,
  yScale,
  height,
  setMinimum,
  setMaximum,
}) => {
  const width = xScale.range()[1];

  function setFilterBounds(inputs) {
    if (inputs?.length !== 2) {
      inputs = xScale.domain();
    }
    // scale inversion
    setMinimum(xScale.invert(inputs[0]));
    // set bounds
    setMaximum(xScale.invert(inputs[1]));
  }

  return (
    <Brush width={width} height={height} onChange={setFilterBounds}>
      <Histogram
        data={data}
        width={width}
        height={height}
        yScale={yScale}
        xScale={xScale}
        buckets={buckets}></Histogram>
    </Brush>
  );
};

export const QuantitativeFilter = ({
  data,
  xScale,
  buckets,
  height,
  yScale,
  onFilter = (val) => {},
}) => {
  console.log("new Time Filter");
  const [minimum, setMinimum] = useState(d3.min(data));
  const [maximum, setMaximum] = useState(d3.max(data));
  const debouncedMin = useDebounce(minimum, 100);
  const debouncedMax = useDebounce(maximum, 100);
  useEffect(() => {
    onFilter({ filterMin: debouncedMin, filterMax: debouncedMax });
  }, [debouncedMin, debouncedMax]);
  return (
    <BrushableHistogram
      yScale={yScale}
      xScale={xScale}
      buckets={buckets}
      height={height}
      data={data}
      setMinimum={setMinimum}
      setMaximum={setMaximum}></BrushableHistogram>
  );
};
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
