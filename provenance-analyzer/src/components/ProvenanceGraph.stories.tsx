import React from "react";
import { storiesOf } from "@storybook/react";
import * as d3 from "d3";
import provData from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";

let xScale = d3.scaleTime().range([5, 200 - 5]);
// set domains, needs to take in axis from parent to scale all
xScale.domain([0, 1]);
storiesOf("ProvGraphs", module).add("small", () => {
  return (
    <div>
      {provData.map((provRound) => (
        <ProvenanceGraph provenanceGraph={provRound} xScale={xScale} />
      ))}
    </div>
  );
});
