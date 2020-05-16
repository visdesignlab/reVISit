import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import chroma from "chroma-js";

const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const GroupedNodes = ({ groupedNodes }: any) => {
  console.log("in grouped Nodes", groupedNodes);
  const rectStartX = groupedNodes[0].x;
  const rectFinishX = groupedNodes[groupedNodes.length - 1].x;
  // if width can't accomodate all actions, expand
  let width = rectFinishX - rectStartX;
  const height = groupedNodes[0].r * 2;
  const y = groupedNodes[0].y - height / 2;

  const baseElement = (
    <g>
      <circle
        cx={rectStartX}
        cy={groupedNodes[0].y}
        r={groupedNodes[0].r}
      ></circle>
      <rect x={rectStartX} y={y} height={height} width={width}></rect>
      <circle
        cx={rectFinishX}
        cy={groupedNodes[0].y}
        r={groupedNodes[0].r}
      ></circle>
    </g>
  );
  return baseElement;
};

export default GroupedNodes;
