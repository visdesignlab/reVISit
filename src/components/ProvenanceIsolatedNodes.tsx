//@ts-nocheck
import React, { useContext } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import styles from "./ProvenanceIsolatedNodes.module.css";
import ProvenanceDataContext from "./ProvenanceDataContext";
import Icon from "@material-ui/core/Icon";
import { iconMapping } from "./eventMapping";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const ProvenanceIsolatedNodes = ({
  nodes,
  selectedItemId,
  hoveredItemId,
  handleHover = ()=>{}, //console.log,
  handleProvenanceNodeClick = ()=>{}, //console.log,
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

export const IsolatedNode = ({ node, configToUse }) => {
  let { actionConfigurations } = useContext(ProvenanceDataContext);

  // if provided a config to use, use that (used for volatile config changes before they are saved)
  if (configToUse) {
    actionConfigurations = configToUse;
  }

  const eventMapping = actionConfigurations;
  // console.log("eventMapping", eventMapping, node);
  let eventMap = eventMapping[node.name]
    ? eventMapping[node.name]
    : { icon: "Add", color: "#fff" };
  //add check for custom icons for newly created events;
  let ProvenanceIcon = iconMapping[eventMap.icon];
  if (!ProvenanceIcon) {
    ProvenanceIcon = () => <g></g>;
  }
  // console.log("in rerender", iconMapping, eventMap.icon, ProvenanceIcon);
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
        <g transform={`translate(7,5)`}>
          {<ProvenanceIcon width={16} height={16} />}
        </g>
      </svg>
    </Tooltip>
  );
  // : (
  //   <div></div>
  // );
};

export default ProvenanceIsolatedNodes;
