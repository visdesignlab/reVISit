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
    <div
      title={node.event}
      className={`${node.event} node`}
      style={{ backgroundColor: eventMapping[node.event].color }}>
      {icon}
    </div>
  ) : (
    <div></div>
  );
};

export default ProvenanceIsolatedNodes;
