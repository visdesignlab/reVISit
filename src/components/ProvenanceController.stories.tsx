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
const nodes1 = [
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
const nodes2 = [
  { id: "56033", name: "startedProvenance", time: 0 },
  { id: "56034", name: "sort", time: 0.0666667 },
  { id: "56035", name: "answerBox", time: 0.216667 },
  { id: "56036", name: "Finished Task", time: 0.283333 },
];
const node3 = [
  { id: "37776", name: "startedProvenance", time: 0 },
  { id: "37777", name: "answerBox", time: 0.483333 },
  { id: "37778", name: "answerBox", time: 0.5 },
  { id: "37779", name: "answerBox", time: 0.516667 },
  { id: "37780", name: "answerBox", time: 0.516667 },
  { id: "37781", name: "answerBox", time: 0.55 },
  { id: "37782", name: "answerBox", time: 0.55 },
  { id: "37783", name: "attrRow", time: 0.566667 },
  { id: "37784", name: "answerBox", time: 0.566667 },
  { id: "37785", name: "attrRow", time: 0.583333 },
  { id: "37786", name: "answerBox", time: 0.6 },
  { id: "37787", name: "answerBox", time: 0.616667 },
  { id: "37788", name: "answerBox", time: 0.633333 },
  { id: "37789", name: "answerBox", time: 0.65 },
  { id: "37790", name: "answerBox", time: 0.666667 },
  { id: "37791", name: "answerBox", time: 0.7 },
  { id: "37792", name: "answerBox", time: 0.7 },
  { id: "37793", name: "answerBox", time: 0.7 },
  { id: "37794", name: "answerBox", time: 0.733333 },
  { id: "37795", name: "answerBox", time: 0.733333 },
  { id: "37796", name: "attrRow", time: 0.783333 },
  { id: "37797", name: "answerBox", time: 0.816667 },
  { id: "37798", name: "answerBox", time: 0.833333 },
  { id: "37799", name: "answerBox", time: 0.85 },
  { id: "37800", name: "answerBox", time: 0.85 },
  { id: "37801", name: "answerBox", time: 0.866667 },
  { id: "37802", name: "answerBox", time: 0.866667 },
  { id: "37803", name: "answerBox", time: 0.883333 },
  { id: "37804", name: "answerBox", time: 0.883333 },
  { id: "37805", name: "answerBox", time: 0.9 },
  { id: "37806", name: "answerBox", time: 0.916667 },
  { id: "37807", name: "answerBox", time: 0.966667 },
  { id: "37808", name: "answerBox", time: 0.983333 },
  { id: "37809", name: "answerBox", time: 1 },
  { id: "37810", name: "answerBox", time: 1.01667 },
  { id: "37811", name: "answerBox", time: 1.03333 },
  { id: "37812", name: "answerBox", time: 1.13333 },
  { id: "37813", name: "answerBox", time: 1.23333 },
  { id: "37814", name: "answerBox", time: 1.4 },
  { id: "37815", name: "attrRow", time: 1.45 },
  { id: "37816", name: "answerBox", time: 1.46667 },
  { id: "37817", name: "answerBox", time: 1.48333 },
  { id: "37818", name: "answerBox", time: 1.58333 },
  { id: "37819", name: "answerBox", time: 1.58333 },
  { id: "37820", name: "answerBox", time: 1.6 },
  { id: "37821", name: "answerBox", time: 1.6 },
  { id: "37822", name: "answerBox", time: 1.61667 },
  { id: "37823", name: "attrRow", time: 1.61667 },
  { id: "37824", name: "answerBox", time: 1.63333 },
  { id: "37825", name: "answerBox", time: 1.65 },
  { id: "37826", name: "answerBox", time: 1.66667 },
  { id: "37827", name: "answerBox", time: 1.7 },
  { id: "37828", name: "answerBox", time: 1.76667 },
  { id: "37829", name: "answerBox", time: 1.76667 },
  { id: "37830", name: "answerBox", time: 1.78333 },
  { id: "37832", name: "attrRow", time: 1.8 },
  { id: "37831", name: "answerBox", time: 1.8 },
  { id: "37833", name: "answerBox", time: 1.81667 },
  { id: "37834", name: "answerBox", time: 1.83333 },
  { id: "37835", name: "answerBox", time: 1.83333 },
  { id: "37836", name: "answerBox", time: 1.88333 },
  { id: "37837", name: "answerBox", time: 1.88333 },
  { id: "37838", name: "answerBox", time: 1.9 },
  { id: "37839", name: "answerBox", time: 1.9 },
  { id: "37840", name: "answerBox", time: 1.91667 },
  { id: "37841", name: "answerBox", time: 1.93333 },
  { id: "37842", name: "answerBox", time: 1.95 },
  { id: "37843", name: "attrRow", time: 1.96667 },
  { id: "37844", name: "attrRow", time: 1.96667 },
  { id: "37845", name: "answerBox", time: 1.98333 },
  { id: "37846", name: "answerBox", time: 1.98333 },
  { id: "37847", name: "attrRow", time: 2 },
  { id: "37848", name: "answerBox", time: 2.01667 },
  { id: "37849", name: "Finished Task", time: 2.05 },
];

const stories = storiesOf("Provenance Controller", module);
stories.addDecorator(withKnobs);
const ProvenanceController = ({ nodes, selectedNode }) => {
  const [selectedItemId, setSelectedItemIdInternal] = React.useState(
    selectedNode
  );
  const setSelectedItemId = (id) => {
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
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 20px",
        gridTemplateColumns: "max-content",
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
          overflow: "hidden",
        }}>
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
    </div>
  );
};
stories.add("small", () => (
  <ProvenanceController nodes={nodes1}></ProvenanceController>
));

stories.add("smaller", () => (
  <ProvenanceController nodes={nodes2}></ProvenanceController>
));

stories.add("big", () => (
  <ProvenanceController nodes={node3}></ProvenanceController>
));