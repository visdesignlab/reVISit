import React, { useRef, useEffect } from "react";
import GroupedNodes from "./GroupedNodes";
import ProvenanceNode from "./ProvenanceNode";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const ProvenanceNodes = ({ performance, xScale, eventType }: any) => {
  if (!performance) {
    return <div></div>;
  }

  let margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svgWidth - margin.right - margin.left,
    height = svgHeight - margin.top - margin.bottom;
  // set domains, needs to take in axis from parent to scale all

  const barHeight = 60;
  const yOffset = 0;

  let provNodes = [];

  performance.provenance.forEach((node) => {
    if (
      node.event === "startedProvenance" ||
      node.event === "Finished Task" ||
      (eventType && eventType !== "overall" && eventType !== node.event)
    ) {
      return;
    }

    provNodes.push({
      x: xScale(node.time * performance.totalTime),
      y: yOffset + barHeight / 2,
      info: node.event,
    });
  });
  let provElements = [];

  for (let i = 0; i < provNodes.length; i++) {
    let item = (
      <ProvenanceNode
        key={i}
        data={provNodes[i]}
        barHeight={barHeight}
        renderIcons={false}></ProvenanceNode>
    );

    provElements.push(
      <g transform={`translate(${provNodes[i].x},${0})`}>{item}</g>
    );
  }

  // for any

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return <g>{provElements}</g>;
};

export default ProvenanceNodes;
