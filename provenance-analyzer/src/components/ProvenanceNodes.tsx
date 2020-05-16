import React, { useRef, useEffect } from "react";

import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const ProvenanceNodes = ({ provenanceGraph }: any) => {
  if (!provenanceGraph) {
    console.log(provenanceGraph);
    return <div></div>;
  }

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

  let provNodes = [];

  provenanceGraph.nodes.forEach((node) => {
    if (node.event === "startedProvenance" || node.event === "Finished Task") {
      return;
    }
    provNodes.push({
      x: xScale(node.time),
      y: yOffset + barHeight / 2,
      r: barHeight / 3,
      fill: "lightgray",
    });
  });

  console.log(provNodes);
  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return (
    <g>
      {provNodes.map((d, i) => {
        return <circle cx={d.x} cy={d.y} r={d.r} fill={d.fill}></circle>;
      })}
    </g>
  );
};

export default ProvenanceNodes;
