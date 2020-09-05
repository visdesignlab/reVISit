import React, { useState, useContext, useEffect, Component } from "react";
import ProvenanceDataContext from "./ProvenanceDataContext";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ActionItemNode } from "./ActionLegend";
import { Delete } from "@material-ui/icons";
const EventManager = ({ handleEditActionConfiguration }) => {
  const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );

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

  return (
    <GroupedList
      listEvents={listEvents}
      handleActionConfigurationChange={handleActionConfigurationChange}
      handleAddGroup={handleAddConfigurationToList}
      initialItems={actionConfigurationsList}
      handleEditActionConfiguration={handleEditActionConfiguration}
      type="sequence"></GroupedList>
  );
};

export default EventManager;
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

const grid = 8;

const Content = styled.div`
  margin-right: 200px;
`;

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

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px
    ${(props) => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 200px;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

export const GroupedList = ({
  initialItems,
  type,
  handleAddGroup,
  handleEditActionConfiguration,
  handleActionConfigurationChange,
  listEvents,
}) => {
  console.log(initialItems);
  const [renderedItems, setRenderedItems] = useState(
    initialItems.map((item) => Object.assign(item, { dragId: uuid() }))
  );
  useEffect(() => {
    console.log("in unique render of grouped list");
  }, []);

  //const [listEvents, setListEvents] = useState({});
  function addList(e) {
    //let copyEvents = Object.assign({}, listEvents);
    let newListName = uuid();

    let newListEvents = {
      [newListName]: {
        id: newListName,
        name: `${type}-${newListName}`,
        type: type,
        hidden: false,
        icon: "Add",
        color: "#ddd",
        elements: [],
      },
    };
    handleAddGroup(newListEvents[newListName]);
    /*
    setListEvents((currentEvents) => {
      let copyEvents = Object.assign({}, currentEvents);
      copyEvents = Object.assign(copyEvents, newListEvents);
      console.log("about to add", copyEvents);

      return copyEvents;
    });*/
  }
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    let copyListItem, copyListEvents;
    switch (source.droppableId) {
      case destination.droppableId:
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
  console.log(listEvents);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ITEMS" isDropDisabled={true}>
        {(provided, snapshot) => (
          <Kiosk
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}>
            {renderedItems.map((item, index) => (
              <Draggable
                key={item.dragId}
                draggableId={item.dragId}
                index={index}>
                {(provided, snapshot) => (
                  <React.Fragment>
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      style={provided.draggableProps.style}>
                      {
                        <ActionItemNode
                          actionConfiguration={item}></ActionItemNode>
                      }
                    </Item>
                    {snapshot.isDragging && (
                      <Clone>
                        <ActionItemNode
                          actionConfiguration={item}></ActionItemNode>
                      </Clone>
                    )}
                  </React.Fragment>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Kiosk>
        )}
      </Droppable>
      <Content>
        <Button onClick={addList}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>
          <ButtonText>Add List</ButtonText>
        </Button>
        {/*<Droppable droppableID="DELETE">
          {(provided, snapshot) => <Delete></Delete>}
                    </Droppable>*/}

        {Object.keys(listEvents).map((list, i) => (
          <React.Fragment>
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <Container
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}>
                  <div>
                    <ActionItemNode
                      handleActionItemEdit={(actionItem) => {
                        console.log("dywootto in actionitem edit", actionItem);
                        handleEditActionConfiguration(actionItem);
                      }}
                      actionConfiguration={listEvents[list]}></ActionItemNode>
                  </div>
                  {listEvents[list].elements.length
                    ? listEvents[list].elements.map((item, index) => (
                        <Draggable
                          key={item.dragId}
                          draggableId={item.dragId}
                          index={index}>
                          {(provided, snapshot) => {
                            let copyItem = Object.assign({}, item);
                            /*copyItem = Object.assign(copyItem, {
                            dragId: copyItem.dragId,
                          });*/
                            return (
                              <Item
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                isDragging={snapshot.isDragging}
                                style={provided.draggableProps.style}>
                                <div {...provided.dragHandleProps}>
                                  {
                                    <ActionItemNode
                                      actionConfiguration={
                                        copyItem
                                      }></ActionItemNode>
                                  }
                                </div>
                              </Item>
                            );
                          }}
                        </Draggable>
                      ))
                    : !provided.placeholder && <Notice>Drop items here</Notice>}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </React.Fragment>
        ))}
      </Content>
    </DragDropContext>
  );
};
