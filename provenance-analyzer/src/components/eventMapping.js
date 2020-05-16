import React from 'react';
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";
import Add from "@material-ui/icons/Add";
import PanTool from "@material-ui/icons/PanTool";
import Sort from "@material-ui/icons/Sort";
import Highlight from "@material-ui/icons/Highlight";
import TabUnselected from "@material-ui/icons/TabUnselected";

const eventMapping = {
  answerBox: {
    name: "Add",
    icon: < Add width = {
      24
    }
    height = {
      24
    }
    /> 
  },
  "Hard Selected a Node": {
    name: "Add",
    icon: < Add width = {
      24
    }
    height = {
      24
    }
    /> 
  },
  "Dragged Node": {
    name: "PanTool",
    icon: < PanTool width = {
      24
    }
    height = {
      24
    }
    /> 
  },
  sort: {
    name: "Sort",
    icon: < Sort width = {
      24
    }
    height = {
      24
    }
    /> 
  },
  attrRow: {
    name: "Highlight",
    icon: < Highlight width = {
      24
    }
    height = {
      24
    }
    /> 
  },
  "Hard Unselected a Node": {
    name: "TabUnselected",
    icon: < TabUnselected width = {
      24
    }
    height = {
      24
    }
    /> 
  },
};

export default eventMapping;