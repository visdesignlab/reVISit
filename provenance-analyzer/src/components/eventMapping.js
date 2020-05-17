import React from 'react';
import Add from "@material-ui/icons/Add";
import PanTool from "@material-ui/icons/PanTool";
import Sort from "@material-ui/icons/Sort";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Search from "@material-ui/icons/Search";
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
    name: "FiberManualRecordIcon",
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
    name: "FiberManualRecordIcon",
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