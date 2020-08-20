//@ts-nocheck
import React from "react";
import { storiesOf } from "@storybook/react";

import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import { start } from "repl";
import {
  withKnobs,
  text,
  boolean,
  number,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import * as d3 from "d3";
const label = "Tasks";
const nodes = [
  { id: "49607", name: "startedProvenance", time: 0 },
  { id: "49608", name: "sort", time: 0.133333 },
  { id: "49609", name: "sort", time: 0.15 },
  { id: "49610", name: "sort", time: 0.183333 },
  { id: "49611", name: "sort", time: 0.2 },
  { id: "49612", name: "sort", time: 0.216667 },
  { id: "49613", name: "sort", time: 0.233333 },
  { id: "49614", name: "search", time: 0.566667 },
  { id: "49615", name: "answerBox", time: 0.716667 },
  { id: "49616", name: "Finished Task", time: 0.733333 },
];

const stories = storiesOf("Provenance Controller", module);
stories.addDecorator(withKnobs);
const ProvenanceController = ({ nodes, selectedNode }) => {
  const [selectedItemId, setSelectedItemId] = React.useState(selectedNode);
  const commonScale = d3
    .scaleLinear()
    .domain(d3.extent(nodes, (node) => node.time))
    .range([0, 100]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 20px",
        gridTemplateColumns: "minmax(50px,max-content)",
      }}>
      <div style={{ gridRow: 1 }}>
        <ProvenanceIsolatedNodes
          selectedItemId={selectedItemId}
          nodes={nodes}
          handleProvenanceNodeClick={(node) =>
            setSelectedItemId(node.id)
          }></ProvenanceIsolatedNodes>
      </div>
      <div
        style={{
          gridRow: 2,
          width: "100%",
          height: "100%",
          background: "whitesmoke",
        }}>
        <svg viewBox={"0 0 100 20"} preserveAspectRatio>
          {nodes.map((node) => {
            console.log("", selectedItemId, node.id);
            const opacity = node.id === selectedItemId ? 0.5 : 0.1;
            return (
              <rect
                onClick={() => setSelectedItemId(node.id)}
                width={1}
                x={commonScale(node.time)}
                height={5}
                opacity={!!selectedItemId ? opacity : null}></rect>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
stories.add("small", () => (
  <ProvenanceController nodes={nodes}></ProvenanceController>
));
