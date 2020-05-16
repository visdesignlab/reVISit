import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const EventFrequencies = ({ frequencies, scaleFactor }: any) => {
  console.log("freqs", frequencies);
  const icons = Object.keys(frequencies).map((eventName, index) => {
    let icon;
    if (eventMapping[eventName] !== undefined) {
      icon = eventMapping[eventName].icon;
    } else {
      icon = <ThreeDRotation width={24} height={24}></ThreeDRotation>;
    }
    return (
      <g transform={`translate(${index * 20},0)scale(${scaleFactor})`}>
        {icon}
        <g transform={`translate(6,40)`}>
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
