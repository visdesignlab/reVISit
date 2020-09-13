import React, { useRef, useEffect } from "react";
import eventMapping from "./eventMapping.js";
import Icon from "@material-ui/core/Icon";

import ThreeDRotation from "@material-ui/icons/ThreeDRotation";

import GroupedNodes from "./GroupedNodes";
import * as d3 from "d3";
import chroma from "chroma-js";

const EventFrequencies = ({ frequencies, scaleFactor, width, height }: any) => {
  const icons = Object.keys(frequencies).map((eventName, index) => {
    let icon;
    if (eventMapping[eventName] !== undefined) {
      icon = eventMapping[eventName].icon;
    } else {
      icon = <ThreeDRotation width={24} height={24}></ThreeDRotation>;
    }

    //let xTranslate = finish - start < 48 ? -12 : 0;
    scaleFactor = 0.75;
    const iconSize = 16;

    return (
      <g transform={`scale(${scaleFactor})`}>
        {icon}
        <g transform={`translate(${iconSize},${5 + iconSize / 2})`}>
          <text fontFamily={"Roboto"} fontSize={"14"}>
            {frequencies[eventName]}
          </text>
        </g>
      </g>
    );
  });

  return (
    <SvgGrid
      items={icons}
      itemHeight={12}
      itemWidth={24}
      gridWidth={width}
      gridHeight={height}></SvgGrid>
  );
};

const SvgGrid = ({ items, itemHeight, itemWidth, gridHeight, gridWidth }) => {
  let maxRows = Math.floor(gridHeight / itemHeight);
  let maxColumns = Math.floor(gridWidth / itemWidth);

  let numberItems = items.length;

  let numberColumns = numberItems > maxColumns ? maxColumns : numberItems;
  let numberRows =
    numberItems === numberColumns ? 1 : Math.ceil(numberItems / numberColumns);
  if (numberItems > maxRows * maxColumns) {
    // render ...
    console.warn("over number of items on", items);
  }

  //
  let currentCol, currentRow;
  let gridItems = [];
  let itemCounter = 0;
  for (currentRow = 0; currentRow < numberRows; currentRow++) {
    //
    let isLastRow = currentRow + 1 == numberRows;
    let startingCol = 0;
    let leftPadding = 0;
    let allPadding = 0;
    if (isLastRow) {
      let numberItemsRemaining = numberItems - itemCounter;
      let padding = maxColumns - numberItemsRemaining;
      leftPadding = padding / 2;
      //startingCol = Math.floor(padding / 2);
      //leftPadding = Math.floor(padding / 2);
      //allPadding = padding;
    }

    for (currentCol = startingCol; currentCol < numberColumns; currentCol++) {
      gridItems.push(
        <g
          transform={`translate(${(currentCol + leftPadding) * itemWidth},${
            currentRow * itemHeight
          })`}
          onClick={() => {}}>
          {items[itemCounter]}
        </g>
      );
      itemCounter++;
    }
  }
  if (gridItems.length === 0) {
  }
  return (
    <g className={"svggrid"} onClick={() => {}}>
      {gridItems}
    </g>
  );
};

export default EventFrequencies;
