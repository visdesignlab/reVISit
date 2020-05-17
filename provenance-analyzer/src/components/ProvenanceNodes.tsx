import React, { useRef, useEffect } from "react";
import GroupedNodes from "./GroupedNodes";
import ProvenanceNode from "./ProvenanceNode";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const ProvenanceNodes = ({ provenanceGraph, xScale, renderIcons }: any) => {
  if (!provenanceGraph) {
    console.log(provenanceGraph);
    return <div></div>;
  }

  let margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svgWidth - margin.right - margin.left,
    height = svgHeight - margin.top - margin.bottom;
  // set domains, needs to take in axis from parent to scale all

  const barHeight = 50;
  const yOffset = 50;

  let provNodes = [];
  let xExtents = [];
  let radius = barHeight / 3;

  // calculate groupings. Pass each grouping into <Grouping Etren
  let currentGroup = [];

  provenanceGraph.nodes.forEach((node) => {
    if (node.time > 1 || node.time < 0) {
      console.log("GREATER THAN 1", node);
    }
    if (node.event === "startedProvenance" || node.event === "Finished Task") {
      return;
    }

    xExtents.push({
      start: xScale(node.time) - radius,
      stop: xScale(node.time) + radius,
    });

    provNodes.push({
      x: xScale(node.time),
      y: yOffset + barHeight / 2,
      r: radius,
      fill: "lightgray",
      info: node.event,
    });
  });
  let provElements = [];
  if (renderIcons) {
    for (let i = 0; i < provNodes.length; i++) {
      let d = provNodes[i];

      let item;
      // if not last node and this element overlaps with next
      if (i < xExtents.length - 1 && xExtents[i].stop > xExtents[i + 1].start) {
        let groupedNodes = [];
        let data = d;
        // start grouping
        groupedNodes.push(data);
        // a group starts
        while (
          provNodes.length - 1 > i &&
          xExtents[i].stop > xExtents[i + 1].start
        ) {
          data = provNodes[i + 1];
          groupedNodes.push(data);
          i++;
        }
        data = provNodes[i];
        groupedNodes.push(data);
        item = (
          <GroupedNodes
            groupedNodes={groupedNodes}
            barHeight={barHeight}></GroupedNodes>
        );
      } else {
        item = (
          <ProvenanceNode
            circle={d}
            barHeight={barHeight}
            renderIcons={true}></ProvenanceNode>
        );
      }
      provElements.push(
        <g transform={`translate(${d.x},${d.y - barHeight / 4})`}>{item}</g>
      );
    }
  } else {
    for (let i = 0; i < provNodes.length; i++) {
      let d = provNodes[i];
      let item = (
        <ProvenanceNode
          circle={d}
          barHeight={barHeight}
          renderIcons={false}></ProvenanceNode>
      );

      provElements.push(
        <g transform={`translate(${d.x},${d.y - barHeight / 2})`}>{item}</g>
      );
    }
  }

  // for any

  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  return <g>{provElements}</g>;
};

export default ProvenanceNodes;
