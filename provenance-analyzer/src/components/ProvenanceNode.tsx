import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const ProvenanceNode = ({ circle, barHeight, renderIcons }: any) => {
  let node;
  const height = barHeight - 10;

  if (renderIcons) {
    let iconSize = barHeight / 2;
    console.log(circle.info);
    // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
    let icon;
    if (eventMapping[circle.info] !== undefined) {
      icon = eventMapping[circle.info].icon;
    } else {
      icon = <ThreeDRotation width={24} height={24}></ThreeDRotation>;
    }
    const y = circle.y - height / 2;
    const color = "lightgray";
    const width = 21;
    node = (
      <g>
        <rect
          y={-circle.r / 4}
          x={-circle.r.r}
          height={height}
          width={width}
          fill={color}
          rx={10}></rect>
        <g transform={`translate(${1},${4})`}>{icon}</g>
      </g>
    );
  } else {
    node = (
      <rect width={3} height={height} color={"black"} opacity={0.5}></rect>
    );
  }

  return <g>{node}</g>;
};

export default ProvenanceNode;
