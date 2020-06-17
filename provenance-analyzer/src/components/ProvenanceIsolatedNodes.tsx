import React from "react";
import eventMapping from "./eventMapping.js";
import styles from "./ProvenanceIsolatedNodes.module.css";
const ProvenanceIsolatedNodes = ({ nodes }) => {
  return (
    <div className={styles.wrapper}>
      {nodes.map((node) => (
        <IsolatedNode node={node}></IsolatedNode>
      ))}
    </div>
  );
};

const IsolatedNode = ({ node }) => {
  console.log("dywootto node data", node, eventMapping);
  const icon = eventMapping[node.event].icon;

  return node.event !== "startedProvenance" &&
    node.event !== "Finished Task" ? (
    <div title={node.event} className={`${node.event} node`}>
      <svg width={34} height={30}>
        <rect
          x={0}
          y={0}
          width={30}
          height={30}
          rx={5}
          fill={eventMapping[node.event].color}></rect>
        <g transform={`translate(7,5)`}>{icon}</g>
      </svg>
    </div>
  ) : (
    <div></div>
  );
};

export default ProvenanceIsolatedNodes;
