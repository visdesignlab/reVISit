//@ts-nocheck
import React, { useMemo } from "react";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import IconButton from "@material-ui/core/IconButton";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutline from "@material-ui/icons/PauseCircleOutline";
import * as d3 from "d3";

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
const ProvenanceController = ({
  nodes,
  selectedNode,
  taskId,
  participantId,
  condition,
}) => {
  //  "https://vdl.sci.utah.edu/mvnv-study/?vis=NL&taskNum=7&participantID=5588d7a1fdf99b304ee56840&taskID=S-task07/#c0203065-9927-42f5-88f6-07189cae6cff";
  console.log(nodes, selectedNode, taskId, participantId, condition);

  const [playInterval, setPlayInterval] = React.useState(null);
  const [hoveredItemId, setHoveredItemId] = React.useState(null);
  const [selectedItemId, setSelectedItemIdInternal] = React.useState(
    selectedNode.id
  );

  let url = `https://vdl.sci.utah.edu/mvnv-study/?vis=${
    conditionEnums[condition]
  }&taskNum=${parseTaskNumFromId(
    taskId
  )}&participantID=${participantId}&taskID=${taskId}/#${
    nodes.find((node) => node.id === selectedItemId)?.dataID
  }`;
  console.log(
    url,
    url ===
      "https://vdl.sci.utah.edu/mvnv-study/?vis=NL&taskNum=7&participantID=5588d7a1fdf99b304ee56840&taskID=S-task07/#c0203065-9927-42f5-88f6-07189cae6cff"
  );

  function handlePlayClick() {
    // set if not selected
    setPlayInterval(setInterval(handleForward, 1000));
  }
  function handlePauseClick() {
    clearInterval(playInterval);
    setPlayInterval(null);
  }

  const setSelectedItemId = (id) => {
    // make async call to load data
    if (id === selectedItemId) {
      setSelectedItemIdInternal(null);
    } else {
      setSelectedItemIdInternal(id);
    }
  };

  console.log("dywootto", hoveredItemId);

  function handleForward() {
    // TODO handle case if
    console.log("in forward", selectedItemId);

    setSelectedItemId((previousId) => {
      if (!previousId) {
        setSelectedItemId(nodes[0].id);
      }
      const currentIndex = nodes.findIndex((node) => node.id === previousId);
      console.log("in forward", currentIndex);

      // if at the end, do nothing
      if (currentIndex === nodes.length - 1 || currentIndex === -1) {
        return nodes[0].id;
      }
      return nodes[currentIndex + 1].id;
    });
  }
  function handleBackward() {
    console.log("in backward", selectedItemId);
    if (!selectedItemId) {
      setSelectedItemId(nodes[0].id);
    }
    const currentIndex = nodes.findIndex((node) => node.id === selectedItemId);
    console.log("in backward", currentIndex);

    // if at the begining, do nothing
    if (currentIndex < 1) {
      return;
    }
    setSelectedItemId(nodes[currentIndex - 1].id);
  }

  return (
    <div>
      <div style={{ height: 900 }}>
        <iframe width={"100%"} height={"100%"} src={url}></iframe>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "50px 20px 30px",
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
          <TimeLine
            hoveredItemId={hoveredItemId}
            setHoveredItemId={(id) => setHoveredItemId(id)}
            selectedItemId={selectedItemId}
            nodes={nodes}
            setSelectedItemId={(node) => setSelectedItemId(node.id)}></TimeLine>
        </div>
        <div
          style={{
            gridRow: 2,
            width: "100%",
            height: "100%",
            background: "whitesmoke",
            overflow: "scroll",
          }}></div>
        <div style={{ gridRow: 3, width: "100%", height: "100%" }}>
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
      .range([0, 100]);
  }, [nodes]);
  return (
    <svg viewBox={"0 0 100 20"} perserveAspectRatio="none">
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
            onClick={() => setSelectedItemId(node.id)}
            width={0.75}
            x={commonScale(node.time)}
            height={20}
            opacity={opacity}></rect>
        );
      })}
    </svg>
  );
};
