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
    const iconSize = 16;
    return (
      <g
        transform={`translate(${xTranslate},0)`}
        onClick={(e) => {
          console.log(frequencies, start, finish);
        }}>
        <g transform={`translate(${index * 20},0)scale(${scaleFactor})`}>
          {icon}
          <g transform={`translate(${iconSize},${5 + iconSize / 2})`}>
            <text fontFamily={"Roboto"} fontSize={"14"}>
              {frequencies[eventName]}
            </text>
          </g>
        </g>
      </g>
    );
  });

  return icons;
};

const SvgGrid = ({
  items,
  itemHeight,
  itemWidth,
  gridHeight,
  gridWidth,
  centerItems,
}) => {
  let maxRows = Math.floor(gridHeight / itemHeight);
  let maxColumns = Math.floor(gridWidth / itemWidth);

  let numberItems = items.length;

  let numberColumns = numberItems > maxColumns ? maxColumns : numberItems;
  let numberRows =
    numberItems === numberColumns
      ? 1
      : Math.Ceiling(numberItems / numberColumns);

  if (numberItems > maxRows * maxColumns) {
    // render ...
  }

  // create grid
  // adjust positioning for items to be in middle, 1 based row 1 based column
  //let currentRow = 1;
  let currentColumn = 1;
  let totalSpaces = numberColumns * numberRows;

  //
  let currentCol, currentRow;
  let gridItems = [];
  let itemCounter = 0;
  for (currentRow = 0; currentRow < numberRows; currentRow++) {
    //
    let isLastRow = currentRow + 1 == numberRows;
    let startingCol = isLastRow
      ? Math.floor((maxRows * maxColumns - numberItems) / 2)
      : 0; /* The number of items outside perf match */
    for (currentCol = startingCol; currentCol < numberColumns; currentCol++) {
      gridItems.push(
        <g
          transform={`translate(${currentRow * itemHeight},${
            currentCol * itemWidth
          })`}>
          {items[itemCounter]}
        </g>
      );
      itemCounter++;
    }
  }
  return <g>{gridItems}</g>;
};

export default EventFrequencies;
