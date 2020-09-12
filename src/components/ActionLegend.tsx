//@ts-nocheck
import { storiesOf } from "@storybook/react";
import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import { start } from "repl";
import { withKnobs, optionsKnob as options } from "@storybook/addon-knobs";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import ColorPicker from "material-ui-color-picker";
import TextField from "@material-ui/core/TextField";
import { IsolatedNode } from "./ProvenanceIsolatedNodes";
import ProvenanceDataContext from "./ProvenanceDataContext";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Popper from "@material-ui/core/Popper";
import EventManager, { GroupedList } from "./EventManager";
import styled from "styled-components";
import Switch from "@material-ui/core/Switch";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { values } from "mobx";
const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px ${(props) => (props.isDragging ? "dashed #000" : "solid #ddd")};
`;

const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`;

function checkIfGroupDuplicates(allItemConfig) {
  const usedGroupedElements = {};
  let duplicatedFlag = false;
  Object.entries(allItemConfig).map(([key, value]) => {
    if (value.type === "group") {
      value.elements.forEach((element) => {
        if (usedGroupedElements[element.id]) {
          duplicatedFlag = true;
          return;
        }
        usedGroupedElements[element.id] = true;
      });
    }
  });
  return duplicatedFlag;
}
const ActionLegendDragContainer = (props) => {
  /*const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );*/
  // console.log(props);
  const {
    actionConfigurations,
    setActionConfigurationsList,
    collapsed,
    handleActionItemEdit,
    isActionLegendEditing,
    hashMapConfig,
  } = props;
  const listRef = useRef(null);

  function handleAddConfigurationToList(item) {
    const copy = [...actionConfigurations];
    copy.push(item);
    setActionConfigurationsList(copy);
  }
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
      case "ITEMS": // if dragged from items
        copyListEvents = { ...listEvents };

        copyListItem = JSON.parse(
          JSON.stringify(copyListEvents[destination.droppableId])
        );
        copyListItem = Object.assign(copyListItem, {
          elements: copy(
            actionConfigurations,
            listEvents[destination.droppableId].elements,
            source,
            destination
          ),
        });
        copyListEvents[destination.droppableId] = copyListItem;

        // console.log("in list event", copyListItem, copyListEvents);
        if (checkIfGroupDuplicates(copyListEvents)) {
          console.error("cannot add duplicate items to group");
          return;
        }
        handleActionConfigurationChange(copyListItem);
        //setListEvents(copyListEvents);
        break;
      default:
        // if moved from a list
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
    const index = actionConfigurations.findIndex(
      (config) => config.id === item.id
    );
    let copy = [...actionConfigurations];
    copy[index] = item;
    setActionConfigurationsList(copy);
  }
  // filter

  let listEvents = {};
  actionConfigurations.forEach((config) => {
    listEvents[config.id] = config;
  });

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
      {listRef.current && isActionLegendEditing && (
        <Pop
          hashMapConfig={hashMapConfig}
          actionConfigurationsList={actionConfigurations}
          handleAddConfigurationToList={handleAddConfigurationToList}
          reference={listRef.current}
          open={!collapsed}
          handleActionItemEdit={handleActionItemEdit}></Pop>
      )}
    </DragDropContext>
  );
};
function compileActionListToHashTable(list) {
  let newActionObject = {};
  list.forEach((item) => {
    let newObject = {};
    newObject[item.id] = item;
    Object.assign(newActionObject, newObject);
  });
  return newActionObject;
}
export const ActionLegend = (props) => {
  const [actionItemBeingEdited, setActionItemBeingEdited] = useState(null);
  const [isActionLegendEditing, setIsActionLegendEditing] = useState(false);
  const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );
  useEffect(() => {
    setVolatileActionConfigurationList(actionConfigurationsList);
  }, [actionConfigurationsList]);
  const [
    volatileActionConfigurationList,
    setVolatileActionConfigurationList,
  ] = useState(actionConfigurationsList);

  const hashMapConfig = useMemo(() => {
    const hashConfig = compileActionListToHashTable(
      volatileActionConfigurationList
    );
    // console.log(
    //   "compiling new configs",
    //   hashConfig,
    //   volatileActionConfigurationList
    // );
    return hashConfig;
  }, [volatileActionConfigurationList]);
  function cancelChanges() {
    // set to orgiinal
    setVolatileActionConfigurationList(actionConfigurationsList);
    setIsActionLegendEditing(false);
  }
  function handleSaveActionConfiguration(newConfiguration) {
    const configurationIndex = volatileActionConfigurationList.findIndex(
      (config) => config.id === newConfiguration.id
    );
    let configCopy = [...volatileActionConfigurationList];
    configCopy[configurationIndex] = newConfiguration;

    // if an action configuration isn't a raw event and was deleted, remove it.
    /*if (newConfiguration.type !== "raw" && newConfiguration.hidden) {
      console.log("deleting config", configCopy);
      configCopy.splice(configurationIndex, 1);
    }*/
    setVolatileActionConfigurationList(configCopy);
    setActionItemBeingEdited(null);
  }
  function saveChanges() {
    setActionConfigurationsList(volatileActionConfigurationList);
    setIsActionLegendEditing(false);
  }
  return (
    <div>
      {!props.collapsed ? (
        isActionLegendEditing ? (
          <div>
            <Button variant={"primary"} onClick={saveChanges}>
              Apply Changes
            </Button>
            <Button variant="secondary" onClick={cancelChanges}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant={"primary"}
            onClick={() => setIsActionLegendEditing(true)}>
            Edit Action List
          </Button>
        )
      ) : null}
      <ActionLegendDragContainer
        hashMapConfig={hashMapConfig}
        isActionLegendEditing={isActionLegendEditing}
        setActionConfigurationsList={setVolatileActionConfigurationList}
        actionConfigurations={volatileActionConfigurationList}
        handleActionItemEdit={
          isActionLegendEditing ? setActionItemBeingEdited : null
        }
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

const CustomTypeFields = ({
  volatileConfiguration,
  handleConfigurationPropertyChange,
}) => {
  let fields;
  if (volatileConfiguration.type === "raw") {
    fields = (
      <Switch
        checked={volatileConfiguration.hidden}
        onChange={(event) =>
          handleConfigurationPropertyChange("hidden", event.target.value)
        }
        name="checkedA"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
    );
  } else {
    fields = (
      <Button onClick={() => {}} color="secondary">
        Delete
      </Button>
    );
  }
  return <div>{fields}</div>;
};

const EditActionForm = ({
  actionConfiguration,
  handleActionConfigurationChange,
  handleActionConfigurationCancel,
}) => {
  // console.log("in edit action form", actionConfiguration);

  const [volatileConfiguration, setVolatileConfiguration] = useState(
    actionConfiguration
  );
  // console.log("edit form volatile config", volatileConfiguration);
  if (!actionConfiguration.id) {
    // console.error(`action configuration is missing an id.`);
    return <div></div>;
  }
  function handleConfigurationPropertyChange(key, newValue) {
    // console.log("property changing", key, newValue);
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

      <div style={{ order: 3, margin: "auto" }}>
        <label
          for={"deleteToggle"}
          className={
            "MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"
          }>
          {volatileConfiguration.type === "raw"
            ? "Hide Element"
            : "Delete Element"}
        </label>
        <Switch
          id={"deleteToggle"}
          checked={volatileConfiguration.hidden}
          onChange={(event) =>
            handleConfigurationPropertyChange(
              "hidden",
              !volatileConfiguration.hidden
            )
          }
          name="checkedA"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />
      </div>
      <div style={{ order: 4 }}></div>
      <div style={{ order: 5, margin: "auto" }}>
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
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];

  destClone.splice(droppableDestination.index, 0, { ...item, dragId: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const Pop = ({
  open,
  handleActionItemEdit,
  reference,
  handleAddConfigurationToList,
  actionConfigurationsList,
  hashMapConfig,
}) => {
  // console.log("in render popover", open, handleActionItemEdit, reference);
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
              width: "650px",
              height: "100%",
              padding: "8px",
              display: "flex",
              overflow: "auto",
              border: "1px lightgray solid",
            }}>
            {
              <EventManager
                hashMapConfig={hashMapConfig}
                actionConfigurationsList={actionConfigurationsList}
                handleAddConfigurationToList={handleAddConfigurationToList}
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
  actionConfigurations,
  handleActionItemEdit,
  collapsed,
  listRef,
  hashMapConfig,
}) => {
  const renderedItems = React.useMemo(() => {
    return actionConfigurations.map((config) =>
      Object.assign(config, { dragId: uuid() })
    );
  }, [actionConfigurations]);
  /*
  <List ref={listRef}>
    {actionConfigurations.map((actionConfiguration) => {
      return (
        <ActionItemNode
          collapsed={collapsed}
          actionConfiguration={actionConfiguration}
          handleActionItemEdit={handleActionItemEdit}></ActionItemNode>
      );
    })}
  </List>
  */

  // console.log("at hashmap config", hashMapConfig);
  return (
    <React.Fragment>
      <div ref={listRef}>
        <Droppable droppableId="ITEMS" isDropDisabled={true}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}>
              {renderedItems.map((item, index) => (
                <Draggable
                  isDragDisabled={collapsed}
                  key={item.dragId}
                  draggableId={item.dragId}
                  index={index}>
                  {(provided, snapshot) => (
                    <React.Fragment>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        style={provided.draggableProps.style}>
                        {
                          <ActionItemNode
                            hashMapConfig={hashMapConfig}
                            collapsed={collapsed}
                            handleActionItemEdit={handleActionItemEdit}
                            actionConfiguration={item}></ActionItemNode>
                        }
                      </div>
                      {snapshot.isDragging && (
                        <div>
                          <ActionItemNode
                            collapsed={collapsed}
                            hashMapConfig={hashMapConfig}
                            handleActionItemEdit={handleActionItemEdit}
                            actionConfiguration={item}></ActionItemNode>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </React.Fragment>
  );
};

export const ActionItemNode = ({
  actionConfiguration,
  handleActionItemEdit,
  collapsed,
  hashMapConfig,
}) => {
  // console.log("in node", actionConfiguration);
  return (
    <ListItem>
      <IsolatedNode
        node={{ name: actionConfiguration.id }}
        configToUse={hashMapConfig}></IsolatedNode>
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
