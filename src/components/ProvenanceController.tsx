//@ts-nocheck
import React, { useMemo, useEffect } from "react";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import IconButton from "@material-ui/core/IconButton";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutline from "@material-ui/icons/PauseCircleOutline";
import * as d3 from "d3";
import { AutoSizer, List } from "react-virtualized";

const conditionEnums = Object.freeze({
  adjMatrix: "AM",
  nodeLink: "NL",
});
function parseTaskNumFromId(taskID) {
  let taskNumber = taskID.match(/\d/g);
  taskNumber = taskNumber.join("");
  // remove leading zeros
  return parseInt(taskNumber, 10);
}
const ProvenanceController = ({ nodes, selectedNode }) => {
  //  "https://vdl.sci.utah.edu/mvnv-study/?vis=NL&taskNum=7&participantID=5588d7a1fdf99b304ee56840&taskID=S-task07/#c0203065-9927-42f5-88f6-07189cae6cff";
  const [playInterval, setPlayInterval] = React.useState(null);
  const [hoveredItemId, setHoveredItemId] = React.useState(null);
  const [selectedItemId, setSelectedItemIdInternal] = React.useState(
    selectedNode.id
  );
  const url = selectedNode.url;

  useEffect(() => {
    let currentIndex = nodes.findIndex((node) => node.id === selectedItemId);
    if (currentIndex > -1) {
      let currentNode = nodes[currentIndex];
      document
        .querySelector("#childFrame")
        .contentWindow.postMessage(currentNode.nodeID, "*");
    }
  }, [selectedItemId]);

  function handlePlayClick() {
    // set if not selected
    setPlayInterval(setInterval(handleForward, 1000));
  }
  function handlePauseClick() {
    clearInterval(playInterval);
    setPlayInterval(null);
  }

  const setSelectedItemId = (id) => {
    // unselect the currently selected node
    if (id === selectedItemId) {
      setSelectedItemIdInternal(null);
    } else {
      setSelectedItemIdInternal(id);
    }
  };

  function handleForward() {
    // TODO handle case if

    setSelectedItemId((previousId) => {
      if (!previousId) {
        setSelectedItemId(nodes[0].id);
      }
      const currentIndex = nodes.findIndex((node) => node.id === previousId);

      // if at the end, do nothing
      if (currentIndex === nodes.length - 1 || currentIndex === -1) {
        return nodes[0].id;
      }
      return nodes[currentIndex + 1].id;
    });
  }

  function handleBackward() {
    if (!selectedItemId) {
      setSelectedItemId(nodes[0].id);
    }
    const currentIndex = nodes.findIndex((node) => node.id === selectedItemId);

    // if at the begining, do nothing
    if (currentIndex < 1) {
      return;
    }
    setSelectedItemId(nodes[currentIndex - 1].id);
  }

  console.log("new url for iframe", url);
  return (
    <div style={{ backgroundColor: "white" }}>
      <div style={{ height: "85vh" }}>
        <iframe
          id={"childFrame"}
          width={"100%"}
          height={"100%"}
          src={url}></iframe>
      </div>
      <div
        style={{
          margin: "0 auto",
          width: "fit-content",
          display: "grid",
          gridTemplateRows: "50px 50px",
          gridTemplateColumns: "min(max-content,1000)",
        }}>
        <div style={{ gridRow: 1, overflow: "scroll" }}>
          <ProvenanceIsolatedNodes
            hoveredItemId={hoveredItemId}
            handleHover={(id) => setHoveredItemId(id)}
            selectedItemId={selectedItemId}
            nodes={nodes}
            handleProvenanceNodeClick={(node) =>
              setSelectedItemId(node.id)
            }></ProvenanceIsolatedNodes>
          <AutoSizer>
            {({ height, width }) => (
              <TimeLine
                width={width}
                hoveredItemId={hoveredItemId}
                setHoveredItemId={(id) => setHoveredItemId(id)}
                selectedItemId={selectedItemId}
                nodes={nodes}
                setSelectedItemId={(node) =>
                  setSelectedItemId(node.id)
                }></TimeLine>
            )}
          </AutoSizer>
        </div>
        <div style={{ gridRow: 2, width: "100%", height: "100%" }}>
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}>
            <IconButton aria-label="delete" onClick={handleBackward}>
              <ArrowBack />
            </IconButton>
            {playInterval && (
              <IconButton aria-label="delete" onClick={handlePauseClick}>
                <PauseCircleOutline />
              </IconButton>
            )}
            {!playInterval && (
              <IconButton aria-label="delete" onClick={handlePlayClick}>
                <PlayCircleOutline />
              </IconButton>
            )}

            <IconButton aria-label="delete" onClick={handleForward}>
              <ArrowForward />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvenanceController;

const TimeLine = (props) => {
  const {
    width,
    nodes,
    setSelectedItemId,
    setHoveredItemId,
    selectedItemId,
    hoveredItemId,
  } = props;
  function determineItemOpacity(node, selectedItemId, hoveredItemId) {
    let opacity;
    if (selectedItemId && node.id !== selectedItemId) {
      opacity = 0.1;
    } else if (hoveredItemId && node.id !== hoveredItemId) {
      opacity = 0.1;
    }
    if (node.id === hoveredItemId || node.id === selectedItemId) {
      opacity = 1;
    }
    return opacity;
  }

  const commonScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(nodes, (node) => node.time))
      .range([5, width - 5]);
  }, [nodes, width]);

  return (
    <svg width={width} height={35}>
      {nodes.map((node, index) => {
        const opacity = determineItemOpacity(
          node,
          selectedItemId,
          hoveredItemId
        );
        //const opacity = node.id === selectedItemId ? 0.5 : 0.1;
        return (
          <rect
            key={`item-${index}`}
            onMouseEnter={() => setHoveredItemId(node.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            onClick={() => setSelectedItemId(node)}
            width={0.75}
            x={commonScale(node.time)}
            height={20}
            opacity={opacity}></rect>
        );
      })}
    </svg>
  );
};
