//@ts-nocheck
import React from "react";
import eventMapping from "./eventMapping.js";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import styles from "./ProvenanceIsolatedNodes.module.css";
const ProvenanceIsolatedNodes = ({
  nodes,
  selectedItemId,
  hoveredItemId,
  handleHover,
  handleProvenanceNodeClick,
}) => {
  // console.log("dywootto", nodes);
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

  return (
    <div
      className={styles.wrapper}
      style={{ display: "flex", flexDirection: "row" }}>
      {nodes.map((node, index) => {
        const opacity = determineItemOpacity(
          node,
          selectedItemId,
          hoveredItemId
        ); //node.id === selectedItemId ? 1 : 0.5;
        return (
          <div
            key={index}
            style={{ opacity }}
            onMouseEnter={() => handleHover(node.id)}
            onMouseLeave={() => handleHover(null)}
            onClick={() => handleProvenanceNodeClick(node)}>
            <IsolatedNode node={node}></IsolatedNode>
          </div>
        );
      })}
    </div>
  );
};

const IsolatedNode = ({ node }) => {
  let eventMap = eventMapping[node.name]
    ? eventMapping[node.name]
    : eventMapping["custom"];
  //add check for custom icons for newly created events;
  const icon = eventMap.icon;
  console.log("in rerender", node);
  // node.event !== "startedProvenance" &&
  //   node.event !== "Finished Task" ?
  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={`${node.name} ${node.count ? `[${node.count}]` : ""}`}
      PopperProps={{
        popperOptions: {
          modifiers: {
            offset: {
              enabled: true,
              offset: "0px, -6px",
            },
          },
        },
      }}
      arrow>
      <svg width={34} height={34}>
        <rect
          x={0}
          y={0}
          width={30}
          height={30}
          rx={5}
          fill={eventMap.color}
          opacity={node.scale || 1}></rect>
        <g transform={`translate(7,5)`}>{icon}</g>
      </svg>
    </Tooltip>
  );
  // : (
  //   <div></div>
  // );
};

export default ProvenanceIsolatedNodes;
