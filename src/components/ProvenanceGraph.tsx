import React, { useRef, useEffect } from "react";
import ProvenanceNodes from "./ProvenanceNodes";
import eventMapping from "./eventMapping";
import * as d3 from "d3";
import chroma from "chroma-js";

const ProvenanceGraph = ({ performance, xScale }) => {
  const svgWidth = 250;
  let svgHeight = 75;

  if (!performance) {
    return <div></div>;
  }

  const barHeight = 50;
  const yOffset = 0;
  const bars = [
    {
      x: 0,
      y: yOffset,
      width: xScale(performance.totalTime),
      height: barHeight,
      fill: "gray",
      type: "overall",
    },
  ];

  let eventTypes = new Set();
  console.log(performance);
  performance.provenance.forEach((node) => {
    if (node.event === "startedProvenance" || node.event === "Finished Task") {
      return;
    }
    eventTypes.add(node.event);
  });

  return bars.map((d, i) => {
    return (
      <g>
        <rect key={i} width={d.width} height={d.height} fill={d.fill} />
        <ProvenanceNodes
          key={`${i}node`}
          performance={performance}
          xScale={xScale}
          eventType={d.type}></ProvenanceNodes>
      </g>
    );
  });
};

export default ProvenanceGraph;
