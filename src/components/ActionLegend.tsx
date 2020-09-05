//@ts-nocheck
import { storiesOf } from "@storybook/react";
import React, { useState, useRef, useContext } from "react";
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
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Popper from "@material-ui/core/Popper";
import EventManager, { GroupedList } from "./EventManager";
import { DragDropContext } from "react-beautiful-dnd";

const ActionLegendDragContainer = (props) => {
  /*const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );*/
  const { actionConfigurationsList } = props;
  const listRef = useRef(null);

  /*function handleAddConfigurationToList(item) {
    const copy = [...actionConfigurationsList];
    copy.push(item);
    setActionConfigurationsList(copy);
  }*/

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    let copyListItem, copyListEvents;
    switch (source.droppableId) {
      case destination.droppableId: // if dropped on same list
        copyListEvents = { ...listEvents };

        copyListItem = JSON.parse(
          JSON.stringify(copyListEvents[destination.droppableId])
        );
        copyListItem = Object.assign(copyListItem, {
          elements: reorder(
            listEvents[source.droppableId].elements,
            source.index,
            destination.index
          ),
        });
        handleActionConfigurationChange(copyListItem);

        copyListEvents[destination.droppableId] = copyListItem;

        //setListEvents(copyListEvents);
        break;
      case "ITEMS":
        copyListEvents = { ...listEvents };

        copyListItem = JSON.parse(
          JSON.stringify(copyListEvents[destination.droppableId])
        );
        copyListItem = Object.assign(copyListItem, {
          elements: copy(
            renderedItems,
            listEvents[destination.droppableId].elements,
            source,
            destination
          ),
        });
        handleActionConfigurationChange(copyListItem);
        copyListEvents[destination.droppableId] = copyListItem;
        //setListEvents(copyListEvents);
        break;
      /*case "DELETE":
        console.log("in delete", source, destination, listEvents);
        break;*/
      default:
        copyListEvents = { ...listEvents };
        // move in between lists
        let copiedSource = JSON.parse(
          JSON.stringify(copyListEvents[source.droppableId])
        );
        let copiedDestination = JSON.parse(
          JSON.stringify(copyListEvents[destination.droppableId])
        );

        const movedChanges = move(
          listEvents[source.droppableId].elements,
          listEvents[destination.droppableId].elements,
          source,
          destination
        );

        copiedSource = Object.assign(copiedSource, {
          elements: movedChanges[source.droppableId],
        });
        copiedDestination = Object.assign(copiedDestination, {
          elements: movedChanges[destination.droppableId],
        });
        handleActionConfigurationChange(copiedSource);
        handleActionConfigurationChange(copiedDestination);

        copyListEvents[source.droppableId] = copiedSource;
        copyListEvents[destination.droppableId] = copiedDestination;

        //setListEvents(copyListEvents);

        break;
    }
  }

  function handleActionConfigurationChange(item) {
    // match item on the id, change it
    const index = actionConfigurationsList.findIndex(
      (config) => config.id === item.id
    );
    let copy = [...actionConfigurationsList];
    copy[index] = item;
    setActionConfigurationsList(copy);
  }
  // filter
  const typedConfigs = actionConfigurationsList.filter(
    (config) => config.type === "sequence"
  );
  let listEvents = {};
  typedConfigs.forEach((config) => {
    listEvents[config.id] = config;
  });
  function handleAddConfigurationToList(item) {
    const copy = [...actionConfigurationsList];
    copy.push(item);
    setActionConfigurationsList(copy);
  }

  /*return (
    <GroupedList
      listEvents={listEvents}
      handleActionConfigurationChange={handleActionConfigurationChange}
      handleAddGroup={handleAddConfigurationToList}
      initialItems={actionConfigurationsList}
      handleEditActionConfiguration={handleEditActionConfiguration}
      type="sequence"></GroupedList>*/

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ActionLegendPresentational
        {...props}
        listRef={listRef}></ActionLegendPresentational>
      {listRef.current && (
        <Pop
          reference={listRef.current}
          open={!collapsed}
          handleActionItemEdit={handleActionItemEdit}></Pop>
      )}
    </DragDropContext>
  );
};
export const ActionLegend = (props) => {
  const [actionItemBeingEdited, setActionItemBeingEdited] = useState(null);
  const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );
  function handleSaveActionConfiguration(newConfiguration) {
    const configurationIndex = actionConfigurationsList.findIndex(
      (config) => config.id === newConfiguration.id
    );
    let configCopy = [...actionConfigurationsList];
    configCopy[configurationIndex] = newConfiguration;
    setActionConfigurationsList(configCopy);
    setActionItemBeingEdited(null);
  }
  return (
    <div>
      <ActionLegendDragContainer
        actionsConfigurations={actionConfigurationsList}
        handleActionItemEdit={setActionItemBeingEdited}
        collapsed={props.collapsed}></ActionLegendDragContainer>
      {actionItemBeingEdited && (
        <Modal
          open={!!actionItemBeingEdited}
          onClose={() => setActionItemBeingEdited(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description">
          <EditActionForm
            actionConfiguration={actionItemBeingEdited}
            handleActionConfigurationCancel={() =>
              setActionItemBeingEdited(null)
            }
            handleActionConfigurationChange={
              handleSaveActionConfiguration
            }></EditActionForm>
        </Modal>
      )}
    </div>
  );
};

class ActionConfiguration {
  constructor(icon, name, id, color) {
    this.icon = icon;
    this.name = name;
    this.id = id;
    this.color = color;
  }
}

const EditActionForm = ({
  actionConfiguration,
  handleActionConfigurationChange,
  handleActionConfigurationCancel,
}) => {
  console.log("in edit action form", actionConfiguration);

  const [volatileConfiguration, setVolatileConfiguration] = useState(
    actionConfiguration
  );
  if (!actionConfiguration.id) {
    console.error(`action configuration is missing an id.`);
    return <div></div>;
  }
  function handleConfigurationPropertyChange(key, newValue) {
    console.log(key, newValue);
    let clonedConfiguration = JSON.parse(JSON.stringify(volatileConfiguration));
    let newConfiguration = {};
    newConfiguration[key] = newValue;

    clonedConfiguration = Object.assign(clonedConfiguration, newConfiguration);
    setVolatileConfiguration(clonedConfiguration);
  }

  return (
    <div
      style={{
        width: "300px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}>
      <div style={{ order: 0, margin: "auto" }}>
        <TextField
          value={volatileConfiguration["id"]}
          onChange={(newValue) =>
            handleConfigurationPropertyChange("id", newValue.target.value)
          }
          disabled
          id="standard-basic"
          label={"id"}
        />
      </div>
      <div style={{ order: 1, margin: "auto" }}>
        <TextField
          value={volatileConfiguration["name"]}
          onChange={(newValue) =>
            handleConfigurationPropertyChange("name", newValue.target.value)
          }
          id="standard-basic"
          label={"name"}
        />
      </div>
      <div style={{ order: 2, margin: "auto" }}>
        <label
          for={"colorPicker"}
          className={
            "MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"
          }>
          Action Color
        </label>
        <ColorPicker
          name={"colorPicker"}
          id={"colorPicker"}
          defaultValue={volatileConfiguration["color"]}
          value={volatileConfiguration["color"]}
          onChange={(newValue) => {
            handleConfigurationPropertyChange("color", newValue);
          }}></ColorPicker>
      </div>
      <div style={{ order: 2, margin: "auto" }}>
        <Button
          color="primary"
          onClick={() =>
            handleActionConfigurationChange(volatileConfiguration)
          }>
          Submit
        </Button>
        <Button onClick={handleActionConfigurationCancel}>Cancel</Button>
      </div>
    </div>
  );
};
const Pop = ({ open, handleActionItemEdit, reference }) => {
  console.log("in render popover", open, handleActionItemEdit, reference);
  return (
    <div>
      {
        <Popper
          open={open}
          id={"hidingpop"}
          anchorEl={reference}
          placement={"right-start"}>
          <div
            style={{
              backgroundColor: "white",
              width: "500px",
              height: "100%",
              padding: "8px",
              display: "flex",
            }}>
            {
              <EventManager
                handleEditActionConfiguration={
                  handleActionItemEdit
                }></EventManager>
            }
          </div>
        </Popper>
      }
    </div>
  );
};
const ActionLegendPresentational = ({
  actionsConfigurations,
  handleActionItemEdit,
  collapsed,
  listRef,
}) => {
  console.log(listRef, listRef ? listRef.current : null);
  return (
    <React.Fragment>
      <List ref={listRef}>
        {actionsConfigurations.map((actionConfiguration) => {
          return (
            <ActionItemNode
              collapsed={collapsed}
              actionConfiguration={actionConfiguration}
              handleActionItemEdit={handleActionItemEdit}></ActionItemNode>
          );
        })}
      </List>
    </React.Fragment>
  );
};

export const ActionItemNode = ({
  actionConfiguration,
  handleActionItemEdit,
  collapsed,
}) => {
  console.log("in node", actionConfiguration);
  return (
    <ListItem>
      <IsolatedNode node={{ name: actionConfiguration.id }}></IsolatedNode>
      {!collapsed && (
        <React.Fragment>
          <ListItemText
            style={{
              maxWidth: "160px",
              overflow: "hidden",
              textOverflow: "truncate",
            }}>
            {actionConfiguration.name}
          </ListItemText>
          {handleActionItemEdit && (
            <EditIcon
              style={{ cursor: "pointer", "margin-left": "auto" }}
              onClick={() =>
                handleActionItemEdit(actionConfiguration)
              }></EditIcon>
          )}
        </React.Fragment>
      )}
    </ListItem>
  );
};
