import React from "react";
import eventMapping from "./eventMapping.js";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import styles from "./ProvenanceIsolatedNodes.module.css";
const ProvenanceIsolatedNodes = ({ nodes }) => {
  // console.log("isolated", nodes);
  return (
    <div className={styles.wrapper}>
      {nodes.map((node, index) => (
        <IsolatedNode key={index} node={node}></IsolatedNode>
      ))}
    </div>
  );
};

const IsolatedNode = ({ node }) => {

  let eventMap = eventMapping[node.id] ? eventMapping[node.id] : eventMapping['custom']
  //add check for custom icons for newly created events;
  const icon = eventMap.icon

  // node.event !== "startedProvenance" &&
  //   node.event !== "Finished Task" ? 
  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={node.event}
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
          fill={eventMap.color}></rect>
        <g transform={`translate(7,5)`}>{icon}</g>
      </svg>
    </Tooltip>
  )
  // : (
  //   <div></div>
  // );
};

export default ProvenanceIsolatedNodes;
