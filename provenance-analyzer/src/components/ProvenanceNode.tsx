import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const ProvenanceNode = ({ circle }: any) => {
  let iconSize = 24;
  // Note when rendering other things in svgs, you must only render things that are svg elements can render- they can't render most react components
  const icon = eventMapping[circle.info].icon;
  console.log("dywootto", icon);
  const circ = (
    <g transform={`translate(${circle.x},${circle.y})`}>
      <circle
        cy={iconSize / 2}
        cx={iconSize / 2}
        r={circle.r}
        fill={circle.fill}></circle>
      {icon}
    </g>
  );
  return circ;
};

export default ProvenanceNode;
