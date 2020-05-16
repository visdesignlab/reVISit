import React from 'react';
import ThreeDRotation from "@material-ui/icons/ThreeDRotation";
import Add from "@material-ui/icons/Add";
import PanTool from "@material-ui/icons/PanTool";
import Sort from "@material-ui/icons/Sort";
import Highlight from "@material-ui/icons/Highlight";
import TabUnselected from "@material-ui/icons/TabUnselected";
import Search from "@material-ui/icons/Search";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Clear from "@material-ui/icons/Clear";

const eventMapping = {
  answerBox: {
    name: "Add",
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
    icon: < Sort width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  attrRow: {
    name: "Highlight",
    icon: < Highlight width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Hard Unselected a Node": {
    name: "TabUnselected",
    icon: < TabUnselected width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "answerBox": {
    name: "Add",
    icon: < Add width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Select Node": {
    name: "Highlight",
    icon: < Highlight width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "rowLabel": {
    name: "Highlight",
    icon: < Highlight width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "colLabel": {
    name: "Highlight",
    icon: < Highlight width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "search": {
    name: "Search",
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
    icon: < Search width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "cell": {
    name: "Highlight",
    icon: < Highlight width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "Unselect Node": {
    name: "HighlightOff",
    icon: < HighlightOff width = {
      16
    }
    height = {
      16
    }
    /> 
  },
  "clear": {
    name: "Clear",
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
    icon: < Clear width = {
      16
    }
    height = {
      16
    }
    /> 
  }
};

export default eventMapping;