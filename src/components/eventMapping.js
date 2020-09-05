import React from "react";
import Add from "@material-ui/icons/Add";
import PanTool from "@material-ui/icons/PanTool";
import Sort from "@material-ui/icons/Sort";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import Start from "@material-ui/icons/Star";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
export const iconMapping = {
  Add,
  PanTool,
  Sort,
  FiberManualRecordIcon,
  RadioButtonUncheckedIcon,
  Search,
  Clear,
  Start,
  PlayArrowIcon,
  StopIcon,
  CheckBoxOutlineBlankIcon,
};
const colors = [
  "#c6e0d6",
  "#8fcab4",
  "#67aca9",
  "#5d83d2",
  "#6b56dd",
  "#9e93a1",
];
// generated from https://leonardocolor.io/?colorKeys=%235b89d2%2C%235dbb9c%2C%23723ce7%2C%238e18b9&base=ffffff&ratios=1.4%2C1.64%2C2.12%2C2.80%2C3.71%2C4.88%2C6.35%2C9.00&mode=CAM02
const answerSelectColor = colors[0];
const dragColor = colors[1];
const sortColor = colors[2];
const selectColor = colors[3];
const searchColor = colors[4];
const clearColor = colors[5];

export const eventMappingList = [
  {
    icon: "PlayArrowIcon",
    color: "#d1d1d1",
    id: "startedProvenance",
    name: "Began Task",
    type: "raw",
  },

  {
    icon: "StopIcon",
    color: "#d1d1d1",
    id: "Finished Task",
    name: "Finished Task",
    type: "raw",
  },
  {
    icon: "Add",
    color: answerSelectColor,
    id: "answerBox",
    name: "Answer Select",
    type: "raw",
  },
  {
    icon: "Add",
    color: answerSelectColor,
    id: "Hard Selected a Node",
    name: "Answer Select",
    type: "raw",
  },
  {
    icon: "PanTool",
    color: dragColor,
    name: "Dragged Node",
    id: "Dragged Node",
    type: "raw",
  },
  {
    icon: "Sort",
    color: sortColor,
    id: "sort",
    name: "Sort",
    type: "raw",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "attrRow",
    name: "Selected a Node",
    type: "raw",
  },
  {
    icon: "RadioButtonUncheckedIcon",
    color: answerSelectColor,
    id: "Hard Unselected a Node",
    name: "Unselected Answer",
    type: "raw",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "Select Node",
    name: "Selected Node",
    type: "raw",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "rowLabel",
    name: "Selected Node",
    type: "raw",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "colLabel",
    name: "Neighbor Highlight",
    type: "raw",
  },
  {
    icon: "Search",
    color: searchColor,
    id: "search",
    name: "Search",
    type: "raw",
  },
  {
    icon: "Search",
    color: searchColor,
    id: "Searched for Node",
    name: "Search",
    type: "raw",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "cell",
    name: "Cell Select",
    type: "raw",
  },

  {
    icon: "RadioButtonUncheckedIcon",
    color: selectColor,
    id: "Unselect Node",
    name: "Unselected Node",
    type: "raw",
  },
  {
    icon: "Clear",
    color: clearColor,
    id: "clear",
    name: "Clear Selections",
    type: "raw",
  },
  {
    icon: "Clear",
    color: clearColor,
    id: "cleared all selected nodes",
    name: "Clear Selections",
    type: "raw",
  },
];
