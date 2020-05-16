import React, { useRef, useEffect } from "react";
import ProvenanceNodes from "./ProvenanceNodes";
import eventMapping from "./eventMapping";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const ProvenanceGraph = ({ provenanceGraph }) => {
  if (!provenanceGraph) {
    console.log(provenanceGraph);
    return <div></div>;
  }
  console.log(provenanceGraph);
  let margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svgWidth - margin.right - margin.left,
    height = svgHeight - margin.top - margin.bottom,
    xScale = d3.scaleTime().range([margin.left, width - margin.right]);
  // set domains, needs to take in axis from parent to scale all
  xScale.domain([
    new Date(provenanceGraph.startTime),
    new Date(provenanceGraph.stopTime),
  ]);
  console.log(xScale);
  const barHeight = 50;
  const yOffset = 50;
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

  console.log(provNodes);
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
              width={d.width}
              height={d.height}
              fill={d.fill}
            />
          );
        })}
        <ProvenanceNodes provenanceGraph={provenanceGraph}></ProvenanceNodes>
      </g>
    </svg>
  );
};

export default ProvenanceGraph;
