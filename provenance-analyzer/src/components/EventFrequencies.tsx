import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";
import FileCloudDownload from "material-ui/core/Icons";
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const EventFrequencies = ({ frequencies, scaleFactor, start, finish }: any) => {
  console.log("freqs", frequencies);
  const icons = Object.keys(frequencies).map((eventName, index) => {
    let icon;
    if (eventMapping[eventName] !== undefined) {
      icon = eventMapping[eventName].icon;
    } else {
      icon = <ThreeDRotation width={24} height={24}></ThreeDRotation>;
    }

    let xTranslate = finish - start < 48 ? -12 : 0;
    scaleFactor = 0.75;
    return (
      <g
        transform={`translate(${xTranslate},0)`}
        onClick={(e) => {
          console.log(frequencies, start, finish);
        }}>
        <g transform={`translate(${index * 20},0)scale(${scaleFactor})`}>
          {icon}
          <g transform={`translate(4,26)`}>
            <text fontFamily={"Roboto"} fontSize={"12"}>
              {frequencies[eventName]}
            </text>
          </g>
        </g>
      </g>
    );
  });

  return icons;
};

export default EventFrequencies;
