//@ts-nocheck
//@ts-nocheck
import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const ProvenanceNode = ({ nodeData, barHeight, renderIcons }: any) => {
  let node;
  const height = barHeight - 10;

  node = (
    <rect width={3} x={0} height={height} color={"black"} opacity={0.25}></rect>
  );

  return <g>{node}</g>;
};

export default ProvenanceNode;
