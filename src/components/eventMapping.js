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
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import TabUnselected from "@material-ui/icons/TabUnselected";
import Crop75 from "@material-ui/icons/Crop75";
import AspectRatio from "@material-ui/icons/AspectRatio";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SelectAll from "@material-ui/icons/SelectAll";
import GetApp from "@material-ui/icons/GetApp";
import Brush from "@material-ui/icons/Brush";
import DragHandleIcon from '@material-ui/icons/DragHandle';

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
  RemoveCircle,
  TabUnselected,
  Crop75,
  AspectRatio,
  VisibilityOff,
  SelectAll,
  GetApp,
  Brush,
  DragHandleIcon
};
const colors = [
  "#c6e0d6",
  "#8fcab4",
  "#67aca9",
  "#5d83d2",
  "#6b56dd",
  "#9e93a1",
];
// generated  from https://leonardocolor.io/?colorKeys=%235b89d2%2C%235dbb9c%2C%23723ce7%2C%238e18b9&base=ffffff&ratios=1.4%2C1.64%2C2.12%2C2.80%2C3.71%2C4.88%2C6.35%2C9.00&mode=CAM02
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
    hidden: false,
  },

  {
    icon: "StopIcon",
    color: "#d1d1d1",
    id: "Finished Task",
    name: "Finished Task",
    type: "raw",
    hidden: false,
  },
  {
    icon: "Add",
    color: answerSelectColor,
    id: "Select Answer",
    name: "Select Answer",
    type: "raw",
    hidden: false,
  },
  {
    icon: "PanTool",
    color: dragColor,
    name: "Dragged Node",
    id: "Dragged Node",
    type: "raw",
    hidden: false,
  },
  {
    icon: "Sort",
    color: sortColor,
    id: "sort",
    name: "Sort",
    type: "raw",
    hidden: false,
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "attrRow",
    name: "Select Node [Attr Row]",
    type: "raw",
    hidden: false,
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
    type: "raw",
    hidden: false,
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
    type: "raw",
    hidden: false,
  },
  {
    icon: "Search",
    color: searchColor,
    id: "search",
    name: "Search",
    type: "raw",
    hidden: false,
  },
  {
    icon: "FiberManualRecordIcon",
    color: selectColor,
    id: "cell",
    name: "Edge Select",
    type: "raw",
    hidden: false,
  },

  {
    icon: "RadioButtonUncheckedIcon",
    color: selectColor,
    id: "Unselect Node",
    name: "Unselect Node",
    type: "raw",
    hidden: false,
  },
  {
    icon: "Clear",
    color: clearColor,
    id: "clear",
    name: "Clear Selections",
    type: "raw",
    hidden: false,
  },
  {
    icon: "Clear",
    color: clearColor,
    id: "clearGroup",
    name: "Cleared Group",
    type: "group",
    hidden: false,
    elements: [
      {
        icon: "Clear",
        color: clearColor,
        id: "clear",
        name: "Clear Selections",
        type: "raw",
        hidden: false,
      },
      {
        icon: "RadioButtonUncheckedIcon",
        color: selectColor,
        id: "Unselect Node",
        name: "Unselect Node",
        type: "raw",
        hidden: false,
      },
    ],
  },
];
