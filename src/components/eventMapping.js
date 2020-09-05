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

export const eventMapping = {
  custom: {
    name: "CustomIcon",
    color: "#d1d1d1",
    icon: <CheckBoxOutlineBlankIcon width={16} height={16} />,
  },

  startedProvenance: {
    name: "PlayArrowIcon",
    color: "#d1d1d1",
    icon: <PlayArrowIcon width={16} height={16} />,
  },
  "Finished Task": {
    name: "StopIcon",
    color: "#d1d1d1",
    icon: <StopIcon width={16} height={16} />,
  },

  answerBox: {
    name: "Add",
    color: answerSelectColor,
    icon: <Add width={16} height={16} />,
  },
  "Hard Selected a Node": {
    name: "Add",
    color: answerSelectColor,
    icon: <Add width={16} height={16} />,
  },
  "Dragged Node": {
    name: "PanTool",
    color: dragColor,
    icon: <PanTool width={16} height={16} />,
  },
  sort: {
    name: "Sort",
    color: sortColor,
    icon: <Sort width={16} height={16} />,
  },
  attrRow: {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: <FiberManualRecordIcon width={16} height={16} />,
  },
  "Hard Unselected a Node": {
    name: "RadioButtonUncheckedIcon",
    color: answerSelectColor,
    icon: <RadioButtonUncheckedIcon width={16} height={16} />,
  },
  "Select Node": {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: <FiberManualRecordIcon width={16} height={16} />,
  },
  rowLabel: {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: <FiberManualRecordIcon width={16} height={16} />,
  },
  colLabel: {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: <FiberManualRecordIcon width={16} height={16} />,
  },
  search: {
    name: "Search",
    color: searchColor,
    icon: <Search width={16} height={16} />,
  },
  "Searched for Node": {
    name: "Search",
    color: searchColor,
    icon: <Search width={16} height={16} />,
  },
  cell: {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: <FiberManualRecordIcon width={16} height={16} />,
  },
  "Unselect Node": {
    name: "RadioButtonUncheckedIcon",
    color: selectColor,
    icon: <RadioButtonUncheckedIcon width={16} height={16} />,
  },
  clear: {
    name: "Clear",
    color: clearColor,
    icon: <Clear width={16} height={16} />,
  },
  "cleared all selected nodes": {
    name: "Clear",
    color: clearColor,
    icon: <Clear width={16} height={16} />,
  },
  // "startedProvenance": {
  //   name: "Start",
  //   color: 'rgb(255,255,255)',
  //   icon: < Start width={
  //     16
  //   }
  //     height={
  //       16
  //     }
  //   />
  // },
  // "Finished Task": {
  //   name: "Start",
  //   color: 'rgb(255,255,255)',
  //   icon: < Start width={
  //     16
  //   }
  //     height={
  //       16
  //     }
  //   />
  // }
};

export const eventMappingList = [
  {
    icon: "PlayArrowIcon",
    color: "#d1d1d1",
    id: "startedProvenance",
    name: "Began Task",
  },

  {
    icon: "StopIcon",
    color: "#d1d1d1",
    id: "Finished Task",
    name: "Finished Task",
  },

  {
    icon: "Add",
    color: answerSelectColor,
    id: "Select Answer",
    name: "Select Answer",
  },
  {
    icon: "PanTool",
    color: dragColor,
    name: "Dragged Node",
    id: "Dragged Node",
  },
  {
    icon: "Sort",
    color: sortColor,
    id: "sort",
    name: "Sort",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "attrRow",
    name: "Selecte Node [Attr Row]",
  },
  {
    icon: "RadioButtonUncheckedIcon",
    color: answerSelectColor,
    id: "Unselect Answer",
    name: "Unselect Answer",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "Select Node",
    name: "Selected Node",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "rowLabel",
    name: "Select Node[rowLabel]",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "colLabel",
    name: "Neighbor Highlight",
  },
  {
    icon: "Search",
    color: searchColor,
    id: "search",
    name: "Search",
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "cell",
    name: "Edge Select",
  },

  {
    icon: "RadioButtonUncheckedIcon",
    color: selectColor,
    id: "Unselect Node",
    name: "Unselect Node",
  },
  {
    icon: "Clear",
    color: clearColor,
    id: "clear",
    name: "Clear Selections",
  }
];
