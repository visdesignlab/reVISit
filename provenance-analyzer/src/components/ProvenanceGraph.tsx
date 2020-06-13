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
  console.log("dywoott in provenance graph", provenanceGraph);
  const [showEvents, setShowEvents] = React.useState(!collapseEvents);

  React.useEffect(() => {
    setShowEvents(!collapseEvents);
  }, [collapseEvents]);

  const svgWidth = 250;
  let svgHeight = 75;

  if (!provenanceGraph) {
    return <div></div>;
  }

  const barHeight = 50;
  const yOffset = 0;
  const bars = [
    {
      x: 0,
      y: yOffset,
      width: xScale(provenanceGraph.totalTime),
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
      x: xScale(node.absoluteTime),
      y: yOffset + barHeight / 2,
      r: barHeight / 3,
      fill: "whitesmoke",
    });
  });
  if (showEvents) {
    svgHeight = svgHeight * (eventTypes.size + 1);
    let counter = 1;
    eventTypes.forEach((type) => {
      bars.push({
        x: 0,
        y: (barHeight + 10) * counter,
        width: xScale(provenanceGraph.totalTime),
        height: barHeight,
        fill: "lightgray",
        type: type,
      });
      counter++;
    });
  }

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return bars.map((d, i) => {
    return (
      <g>
        <rect key={i} width={d.width} height={d.height} fill={d.fill} />
        <ProvenanceNodes
          provenanceGraph={provenanceGraph}
          xScale={xScale}
          renderIcons={renderIcons && d.type === "overall"}
          eventType={d.type}></ProvenanceNodes>
      </g>
    );
  });
};

export default ProvenanceGraph;
