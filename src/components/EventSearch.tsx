import React, { useEffect } from "react";
import styles from "./EventSearch.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Divider } from "antd";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Category from "@material-ui/icons/Category";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";

import { IsolatedNode } from "./ProvenanceIsolatedNodes";
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const actions = [
  "Finished Task",
  "Select Node",
  "Searched for Node",
  "Dragged Node",
  "Unselect Node",
  "search",
  "colLabel",
  "sort",
  "attrRow",
  "answerBox",
  "cell",
  "rowLabel",
  "cleared all selected nodes",
  "clear",
  "Hard Unselected a Node",
  "Hard Selected a Node",
];
const COLLECTION = actions.map((actionName) => {
  console.log(actionName);
  return { id: uuidv4(), label: actionName };
});

// This method is needed for rendering clones of draggables
const getRenderItem = (items, className) => (provided, snapshot, rubric) => {
  const item = items[rubric.source.index];
  return (
    <React.Fragment>
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={provided.draggableProps.style}
        className={snapshot.isDragging ? "dragging" : ""}>
        <IsolatedNode node={{ name: item.label }} />
      </div>
    </React.Fragment>
  );
};

function ActionList(props) {
  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "whitesmoke" }}>
      <Droppable
        renderClone={getRenderItem(props.items, props.className)}
        droppableId={props.droppableId}
        isDropDisabled={true}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className={props.className}>
            {props.items.map((item, index) => {
              const shouldRenderClone =
                item.id === snapshot.draggingFromThisWith;
              return (
                <React.Fragment key={item.id}>
                  {shouldRenderClone ? (
                    <div className="react-beatiful-dnd-copy">
                      {" "}
                      <IsolatedNode node={{ name: item.label }} />
                    </div>
                  ) : (
                    <Draggable draggableId={item.id} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <React.Fragment>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "dragging" : ""}>
                              <IsolatedNode
                                key={`node-${item.id}`}
                                node={{ name: item.label }}
                              />
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </Draggable>
                  )}
                </React.Fragment>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function Shop(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <React.Fragment>
      <IconButton aria-label="Open Event List" onClick={handleClick}>
        <Category />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}>
        <div style={{ overflow: "auto", width: "300px", height: "100px" }}>
          <ActionList
            droppableId="SHOP"
            className={styles.searchOptions}
            items={props.items}
          />
        </div>
      </Popover>
    </React.Fragment>
  );
}

function ShoppingBag(props) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Droppable droppableId="BAG" direction={"horizontal"}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className={styles.searchBar}>
            {props.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}>
                    <IsolatedNode node={{ name: item.label }} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

const reorder = (list, startIndex, endIndex) => {
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);

  return [...list];
};

const copy = (source, destination, droppableSource, droppableDestination) => {
  const item = source[droppableSource.index];
  destination.splice(droppableDestination.index, 0, {
    ...item,
    id: `copy${uuidv4()}`,
  });
  return [...destination];
};

const EventSearch = ({
  onFilter = (val) => {
    console.log(val);
  },
}) => {
  const [shoppingBagItems, setShoppingBagItems] = React.useState([]);
  useEffect(() => {
    if (onFilter) {
      onFilter(shoppingBagItems.length > 0 ? shoppingBagItems : null);
    }
  }, [shoppingBagItems]);
  console.log(shoppingBagItems);
  const onDragEnd = React.useCallback(
    (result) => {
      const { source, destination } = result;

      // if dragged out of any box, delete it
      if (!destination) {
        console.log("in delete node", source.index);
        setShoppingBagItems((state) => {
          const copy = [...state];
          console.log("copy", copy);
          copy.splice(source.index, 1);
          console.log("copy", copy);

          return copy;
        });
        return;
      }

      switch (source.droppableId) {
        case destination.droppableId:
          setShoppingBagItems((state) =>
            reorder(state, source.index, destination.index)
          );
          break;
        case "SHOP":
          setShoppingBagItems((state) =>
            copy(COLLECTION, state, source, destination)
          );
          break;
        default:
          break;
      }
    },
    [shoppingBagItems]
  );

  return (
    <div className={styles.searchContainer}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.outerSearchBar}>
          <ShoppingBag items={shoppingBagItems} />
        </div>
        <div className={styles.outerSearchOptions}>
          <Shop items={COLLECTION} />
        </div>
        <div className={styles.outerSearchDiscard}>
          <Discard />
        </div>
      </DragDropContext>
    </div>
  );
};
const Discard = (props) => {
  return (
    <Droppable droppableId={"DISCARD"} isDropDisabled={true}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} className={props.className}>
          <IconButton>
            {" "}
            <Delete></Delete>
          </IconButton>
        </div>
      )}
    </Droppable>
  );
};
export default EventSearch;
/*const ActionNode = ({ actionName }) => {
  return <div>{actionName[0]}</div>;
};
const SearchOptions = () => {
  /*return (
    <div className={styles.searchOptions}>
      {" "}
      {actions.map((action) => (
        <ActionNode actionName={action} />
      ))}{" "}
    </div>
  );
  return <Droppable
      renderClone={getRenderItem(props.items, props.className)}
      droppableId={props.droppableId}
      isDropDisabled={true}
    >
      {(provided, snapshot) => (
        <ul ref={provided.innerRef} className={props.className}>
          {props.items.map((item, index) => {
            const shouldRenderClone = item.id === snapshot.draggingFromThisWith;
            return (
              <React.Fragment key={item.id}>
                {shouldRenderClone ? (
                  <li className="react-beatiful-dnd-copy">{item.label}</li>
                ) : (
                  <Draggable draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "dragging" : ""}
                        >
                          {item.label}
                        </li>
                      </React.Fragment>
                    )}
                  </Draggable>
                )}
              </React.Fragment>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
};
const SearchList = () => {
  return <div></div>;
};
const SearchBar = () => {
  const [sequence, setSequenceInternal] = React.useState(["a", "b", "c"]);
  console.log(sequence);
  return (
    <div className={styles.searchBar}>
      <Droppable droppableId={"searchBar"}>
        {(provided) => {
          console.log(sequence, provided);

          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sequence.map((item, index) => {
                return <SearchIcon item={item} index={index}></SearchIcon>;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
const SearchIcon = ({ item, index }) => {
  console.log(item, index);
  return (
    <Draggable draggableId={`item${index}`} index={index}>
      {(provided) => {
        console.log("innerest", `item${index}`);
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>{`item${index}`}</div>
        );
      }}
    </Draggable>
  );
};

export default () => {
  console.log("search", styles, styles.searchContainer);
  function handleSequenceChange(input) {
    console.log(input);
  }
  return (
    <div className={styles.searchContainer}>
      <DragDropContext onDragEnd={handleSequenceChange}>
        <SearchBar></SearchBar>
        <SearchOptions></SearchOptions>;
      </DragDropContext>
    </div>
  );
};
*/