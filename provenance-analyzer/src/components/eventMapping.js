import React from 'react';
import Add from "@material-ui/icons/Add";
import PanTool from "@material-ui/icons/PanTool";
import Sort from "@material-ui/icons/Sort";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import Start from "@material-ui/icons/Star";
const colors = ["rgb(194,99,159)", "rgb(227,2,147)", "rgb(83,66,79)", "rgb(199,179,194)", "rgb(120,40,87)", "rgb(255,172,236)"]
const answerSelectColor = colors[0];
const dragColor = colors[1];
const sortColor = colors[2];
const selectColor = colors[3];
const searchColor = colors[4];
const clearColor = colors[5];

const eventMapping = {
  answerBox: {
    name: "Add",
    color: answerSelectColor,
    icon: < Add width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Hard Selected a Node": {
    name: "Add",
    color: answerSelectColor,

    icon: < Add width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Dragged Node": {
    name: "PanTool",
    color: dragColor,
    icon: < PanTool width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  sort: {
    name: "Sort",
    color: sortColor,
    icon: < Sort width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  attrRow: {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: < FiberManualRecordIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Hard Unselected a Node": {
    name: "RadioButtonUncheckedIcon",
    color: answerSelectColor,
    icon: < RadioButtonUncheckedIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Select Node": {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: < FiberManualRecordIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "rowLabel": {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: < FiberManualRecordIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "colLabel": {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: < FiberManualRecordIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "search": {
    name: "Search",
    color: searchColor,
    icon: < Search width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Searched for Node": {
    name: "Search",
    color: searchColor,
    icon: < Search width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "cell": {
    name: "FiberManualRecordIcon",
    color: selectColor,
    icon: < FiberManualRecordIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Unselect Node": {
    name: "RadioButtonUncheckedIcon",
    color: selectColor,
    icon: < RadioButtonUncheckedIcon width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "clear": {
    name: "Clear",
    color: clearColor,
    icon: < Clear width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "cleared all selected nodes": {
    name: "Clear",
    color: clearColor,
    icon: < Clear width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "startedProvenance": {
    name: "Start",
    color: 'rgb(255,255,255)',
    icon: < Start width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Finished Task": {
    name: "Start",
    color: 'rgb(255,255,255)',
    icon: < Start width = {
      16
    }
    height = {
      16
    }
    /> 
  }
};

export default eventMapping;