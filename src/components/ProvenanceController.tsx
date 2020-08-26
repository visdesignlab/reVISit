//@ts-nocheck
import React from "react";
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
  let url = `https://vdl.sci.utah.edu/mvnv-study/?vis=${
    conditionEnums[condition]
  }&taskNum=${parseTaskNumFromId(
    taskId
  )}&participantID=${participantId}&taskID=${taskId}/${selectedNode.dataID}`;
  console.log(
    url,
    url ===
      "https://vdl.sci.utah.edu/mvnv-study/?vis=NL&taskNum=7&participantID=5588d7a1fdf99b304ee56840&taskID=S-task07/#c0203065-9927-42f5-88f6-07189cae6cff"
  );
  const [selectedItemId, setSelectedItemIdInternal] = React.useState(
    selectedNode
  );
  const setSelectedItemId = (id) => {
    // make async call to load data
    if (id === selectedItemId) {
      setSelectedItemIdInternal(null);
    } else {
      setSelectedItemIdInternal(id);
    }
  };
  const commonScale = d3
    .scaleLinear()
    .domain(d3.extent(nodes, (node) => node.time))
    .range([0, 100]);

  return (
    <div>
      <div style={{ height: 1000 }}>
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
            selectedItemId={selectedItemId}
            nodes={nodes}
            handleProvenanceNodeClick={(node) =>
              setSelectedItemId(node.id)
            }></ProvenanceIsolatedNodes>
          <svg viewBox={"0 0 100 20"} perserveAspectRatio="none">
            {nodes.map((node) => {
              console.log("", selectedItemId, node.id);
              const opacity = node.id === selectedItemId ? 0.5 : 0.1;
              return (
                <rect
                  onClick={() => setSelectedItemId(node.id)}
                  width={0.75}
                  x={commonScale(node.time)}
                  height={20}
                  opacity={!!selectedItemId ? opacity : null}></rect>
              );
            })}
          </svg>
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
            <IconButton aria-label="delete">
              <ArrowBack />
            </IconButton>
            <IconButton aria-label="delete">
              <PlayCircleOutline />
            </IconButton>
            <IconButton aria-label="delete">
              <PauseCircleOutline />
            </IconButton>
            <IconButton aria-label="delete">
              <ArrowForward />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvenanceController;
