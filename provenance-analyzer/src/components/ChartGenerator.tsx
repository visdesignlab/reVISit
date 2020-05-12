import React from "react";
import * as d3 from "d3";
import chroma from "chroma-js";
import { SvgIcon } from "@material-ui/core";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
const red = "#eb6a5b";
const green = "#b6e86f";
const blue = "#52b6ca";
const colors = chroma.scale([blue, green, red]).mode("hsl");

const ChartGenerator = ({ data }) => {
  let margin = { left: 20, top: 20, right: 20, bottom: 20 },
    xScale = d3.scaleTime().range([margin.left, width - margin.right]),
    yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]),
    colorScale = d3.scaleLinear();

  // set domains
  const tempMax = d3.max(data);
  const colorDomain = d3.extent(data);
  xScale.domain([0, data.length]);
  yScale.domain([0, tempMax]);
  colorScale.domain(colorDomain);

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

  //d3.select(this.refs.xAxis).call(this.xAxis);
  //d3.select(this.refs.yAxis).call(this.yAxis);

  return (
    <svg width={width} height={height}>
      <SvgIcon>
        <path
          d="M256,32C132.281,32,32,132.281,32,256s100.281,224,224,224s224-100.281,224-224S379.719,32,256,32z M256,448
c-105.875,0-192-86.125-192-192S150.125,64,256,64s192,86.125,192,192S361.875,448,256,448z M160,192c0-26.5,14.313-48,32-48
s32,21.5,32,48c0,26.531-14.313,48-32,48S160,218.531,160,192z M288,192c0-26.5,14.313-48,32-48s32,21.5,32,48
c0,26.531-14.313,48-32,48S288,218.531,288,192z M384,288c-16.594,56.875-68.75,96-128,96c-59.266,0-111.406-39.125-128-96"
        />
      </SvgIcon>
      {bars.map((d, i) => {
        return (
          <div>
            <rect
              key={i}
              x={d.x}
              y={d.y}
              width="10"
              height={d.height}
              fill={d.fill}
            />
          </div>
        );
      })}
    </svg>
  );
};

export default ChartGenerator;
