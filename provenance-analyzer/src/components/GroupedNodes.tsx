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
  const rectStartX = groupedNodes[0].x;
  const rectFinishX = groupedNodes[groupedNodes.length - 1].x;
  // if width can't accomodate all actions, expand
  let width = rectFinishX - rectStartX;
  const height = groupedNodes[0].r * 2;
  const y = groupedNodes[0].y - height / 2;
  const color = "lightgray";
  const baseElement = (
    <g>
      <rect
        y={0}
        height={height}
        width={width + groupedNodes[0].r}
        fill={color}
        rx={10}></rect>
    </g>
  );
  const eventFreq = count(groupedNodes, function (item) {
    return item.info;
  });
  let scaleFactor = width / 24;
  scaleFactor = 1; /*Object.keys(eventFreq).length;
  if (scaleFactor > 0.7) {
    scaleFactor = 0.7;
  } else if (scaleFactor < 0.5) {
    scaleFactor = 0.5;
  }*/
  return (
    <g>
      {baseElement}
      <EventFrequencies
        frequencies={eventFreq}
        scaleFactor={scaleFactor}
        width={width + groupedNodes[0].r}
        height={height}></EventFrequencies>
    </g>
  );
};

export default GroupedNodes;
