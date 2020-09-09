//@ts-nocheck
/*
import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { start } from "repl";
import { withKnobs, optionsKnob as options } from "@storybook/addon-knobs";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import { useEffect } from "@storybook/addons";
import ColorPicker from "material-ui-color-picker";
import TextField from "@material-ui/core/TextField";
import { IsolatedNode } from "./ProvenanceIsolatedNodes";
import ProvenanceDataContext from "./ProvenanceDataContext";
import ActionLegend from "./ActionLegend";
const stories = storiesOf("Action Legend", module);
stories.addDecorator(withKnobs);

stories.add("small", () => (
  <ProvenanceDataContext>
    <ActionLegend collapsed></ActionLegend>
  </ProvenanceDataContext>
));

/*
<List>
        {[
          { text: "Home", id: "Home", link: HomeLink, icon: HomeIcon },
          { text: "Study", id: "Study", link: StudyLink, icon: ComputerIcon },
          { text: "Upload", id: "Upload", link: Upload, icon: CloudUpload },
          { text: "Provenance Prep ", id: "Overview", link: Overview, icon: BarChart },
          {
            text: "Provenance Analysis",
            link: Table,
            id: "Table",
            icon: TableChart,
          },
          { text: "Export", link: Export, icon: GetApp },
        ].map((item, index) => {
          return (
            //added key={index} to get rid of unique key error
            <React.Fragment key={index}>
              <ListItem button component={item.link}>
                <ListItemIcon>{makeIcon(item)}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>


const eventMapping = {
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
};
*/
