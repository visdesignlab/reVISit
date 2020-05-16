import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const EventFrequencies = ({ frequencies, scaleFactor, start, finish }: any) => {
  const icons = Object.keys(frequencies).map((eventName, index) => {
    const icon = eventMapping[eventName].icon;
    return (
      <g transform={`translate(${index * 16},0)scale(${scaleFactor})`}>
        {icon}
        <g transform={`translate(8,40)`}>
          <text fontFamily={"Roboto"} fontSize={"20"}>
            {frequencies[eventName]}
          </text>
        </g>
      </g>
    );
  });

  return <g transform={`translate(${5 / scaleFactor},${0})`}>{icons}</g>;
};

export default EventFrequencies;
