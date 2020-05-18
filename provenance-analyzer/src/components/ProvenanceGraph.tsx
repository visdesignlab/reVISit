import React, { useRef, useEffect } from "react";
import ProvenanceNodes from "./ProvenanceNodes";
import eventMapping from "./eventMapping";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 250;
const svgHeight = 60;
const margin = { top: 5, right: 20, bottom: 5, left: 20 };

const ProvenanceGraph = ({ provenanceGraph, xScale, renderIcons }) => {
  if (!provenanceGraph) {
    return <div></div>;
  }
  let width = svgWidth - margin.right - margin.left,
    height = svgHeight - margin.top - margin.bottom; //,
  //xScale = d3.scaleTime().range([margin.left, width - margin.right]);
  // set domains, needs to take in axis from parent to scale all
  /*xScale.domain([
    new Date(provenanceGraph.startTime),
    new Date(provenanceGraph.stopTime),
  ]);*/
  const barHeight = 50;
  const yOffset = 0;
  const bars = [
    {
      x: 0,
      y: yOffset,
      width:
        xScale(provenanceGraph.stopTime) - xScale(provenanceGraph.startTime),
      height: barHeight,
      fill: "gray",
    },
  ];

  let provNodes = [];

  provenanceGraph.nodes.forEach((node) => {
    if (node.event === "startedProvenance" || node.event === "Finished Task") {
      return;
    }
    provNodes.push({
      x: xScale(node.time),
      y: yOffset + barHeight / 2,
      r: barHeight / 3,
      fill: "whitesmoke",
    });
  });

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return (
    <svg width={svgWidth} height={svgHeight} style={{ float: "left" }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {bars.map((d, i) => {
          return (
            <rect
              key={i}
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              fill={d.fill}
            />
          );
        })}
        <ProvenanceNodes
          provenanceGraph={provenanceGraph}
          xScale={xScale}
          renderIcons={renderIcons}></ProvenanceNodes>
      </g>
    </svg>
  );
};

export default ProvenanceGraph;
