import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import chroma from "chroma-js";
import EventFrequencies from "./EventFrequencies";
const svgWidth = 200;
const svgHeight = 100;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };

function count(ary, classifier) {
  classifier = classifier || String;
  return ary.reduce(function (counter, item) {
    var p = classifier(item);
    counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
    return counter;
  }, {});
}

const GroupedNodes = ({ groupedNodes, barHeight }: any) => {
  console.log("in grouped Nodes", groupedNodes);
  const rectStartX = groupedNodes[0].x;
  const rectFinishX = groupedNodes[groupedNodes.length - 1].x;
  // if width can't accomodate all actions, expand
  let width = rectFinishX - rectStartX + 2 * groupedNodes[0].r;
  const height = groupedNodes[0].r * 2;
  const y = groupedNodes[0].y - height / 2;
  const color = "lightgray";
  const baseElement = (
    <g>
      <circle r={groupedNodes[0].r} cy={barHeight / 4} fill={color}></circle>
      <rect
        y={-groupedNodes[0].r / 4}
        height={height}
        width={width}
        fill={color}></rect>
      <circle
        cx={width}
        r={groupedNodes[0].r}
        cy={barHeight / 4}
        fill={color}></circle>
    </g>
  );
  const eventFreq = count(groupedNodes, function (item) {
    return item.info;
  });
  console.log(eventFreq);
  let scaleFactor = width / 24;
  scaleFactor = scaleFactor / Object.keys(eventFreq).length;
  console.log(scaleFactor);
  if (scaleFactor > 0.7) {
    scaleFactor = 0.7;
  }
  return (
    <g>
      {baseElement}
      <EventFrequencies
        frequencies={eventFreq}
        scaleFactor={scaleFactor}
        start={rectStartX}
        finish={rectFinishX}></EventFrequencies>
    </g>
  );
};

export default GroupedNodes;
