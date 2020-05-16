import React from "react";
import { storiesOf } from "@storybook/react";
import provData from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";

storiesOf("ProvGraphs", module).add("small", () => {
  return (
    <div>
      {provData.map((provRound) => (
        <ProvenanceGraph provenanceGraph={provRound} />
      ))}
    </div>
  );
});
