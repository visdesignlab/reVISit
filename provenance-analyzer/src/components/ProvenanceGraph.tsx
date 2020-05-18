import React, { useRef, useEffect } from "react";
import ProvenanceNodes from "./ProvenanceNodes";
import eventMapping from "./eventMapping";
import * as d3 from "d3";
import chroma from "chroma-js";

const ProvenanceGraph = ({
  provenanceGraph,
  xScale,
  renderIcons,
  collapseEvents,
}) => {
  const [showEvents, setShowEvents] = React.useState(!collapseEvents);

  React.useEffect(() => {
    setShowEvents(!collapseEvents);
  }, [collapseEvents]);

  const svgWidth = 250;
  let svgHeight = 75;
  const margin = { top: 20, right: 20, bottom: 5, left: 20 };

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
      type: "overall",
    },
  ];

  let provNodes = [];
  let eventTypes = new Set();
  provenanceGraph.nodes.forEach((node) => {
    if (node.event === "startedProvenance" || node.event === "Finished Task") {
      return;
    }
    eventTypes.add(node.event);
    provNodes.push({
      x: xScale(node.time),
      y: yOffset + barHeight / 2,
      r: barHeight / 3,
      fill: "whitesmoke",
    });
  });
  if (showEvents) {
    svgHeight = (svgHeight + 15) * (eventTypes.size + 1);
    let counter = 1;
    eventTypes.forEach((type) => {
      bars.push({
        x: 0,
        y: (barHeight + 10) * counter,
        width:
          xScale(provenanceGraph.stopTime) - xScale(provenanceGraph.startTime),
        height: barHeight,
        fill: "lightgray",
        type: type,
      });
      counter++;
    });
  }

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ display: "inline-block" }}>
      <g
        transform={`translate(${margin.left},${margin.top})`}
        onClick={() => {
          setShowEvents(!showEvents);
        }}>
        {bars.map((d, i) => {
          return (
            <g transform={`translate(${d.x},${d.y})`}>
              <text y={-5} fontSize={10} fontFamily={"roboto"}>
                {d.type}
              </text>
              <rect key={i} width={d.width} height={d.height} fill={d.fill} />
              <ProvenanceNodes
                provenanceGraph={provenanceGraph}
                xScale={xScale}
                renderIcons={renderIcons && d.type === "overall"}
                eventType={d.type}></ProvenanceNodes>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default ProvenanceGraph;
