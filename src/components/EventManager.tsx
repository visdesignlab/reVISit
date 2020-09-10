import React, { useEffect } from "react";
import ProvenanceDataContext from "./ProvenanceDataContext";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ActionItemNode } from "./ActionLegend";
import { Delete } from "@material-ui/icons";
const EventManager = ({
  handleAddConfigurationToList,
  handleEditActionConfiguration,
  actionConfigurationsList,
  hashMapConfig,
}) => {
  // filter

  return (
    <div style={{ display: "flex" }}>
      {["sequence", "group"].map((type) => {
        console.log();
        const typedConfigs = actionConfigurationsList.filter(
          (config) => config.type === type
        );
        const nonHiddenConfigs = typedConfigs.filter((config) => {
          console.log(config);
          return config.hidden === 0 || config.hidden === false;
        });
        let listEvents = {};
        nonHiddenConfigs.forEach((config) => {
          listEvents[config.id] = config;
        });
        return (
          <GroupedList
            hashMapConfig={hashMapConfig}
            listEvents={listEvents}
            handleAddGroup={handleAddConfigurationToList}
            initialItems={actionConfigurationsList}
            handleEditActionConfiguration={handleEditActionConfiguration}
            type={type}></GroupedList>
        );
      })}
    </div>
  );
};

export default EventManager;

const grid = 8;

const Content = styled.div`
  width: 310px;
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
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export const GroupedList = ({
  initialItems,
  type,
  handleAddGroup,
  handleEditActionConfiguration,
  listEvents,
  hashMapConfig,
}) => {
  console.log(initialItems);

  useEffect(() => {
    console.log("in unique render of grouped list");
  }, []);

  //const [listEvents, setListEvents] = useState({});
  function addList(e) {
    //let copyEvents = Object.assign({}, listEvents);
    let newListName = uuid(); //uuid();

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

  console.log(listEvents);
  return (
    <div>
      {/*<DragDropContext onDragEnd={onDragEnd}>*/}

      <Content>
        <Button onClick={addList}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>
          <ButtonText>Add {type}</ButtonText>
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
                      hashMapConfig={hashMapConfig}
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
                                      hashMapConfig={hashMapConfig}
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
        {Object.keys(listEvents).length === 0 && (
          <span>
            No {type}s have been created. Click Add {type} to get started
            dragging items.
          </span>
        )}
      </Content>
      {/*</DragDropContext>*/}
    </div>
  );
};
