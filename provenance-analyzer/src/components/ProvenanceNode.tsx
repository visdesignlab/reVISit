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

    node = (
      <g>
        <circle cy={iconSize / 2} r={circle.r} fill={circle.fill}></circle>
        <g transform={`translate(${-circle.r / 2},${4})`}>{icon}</g>
      </g>
    );
  } else {
    node = (
      <rect width={3} height={barHeight} color={"black"} opacity={0.5}></rect>
    );
  }

  return <g>{node}</g>;
};

export default ProvenanceNode;
