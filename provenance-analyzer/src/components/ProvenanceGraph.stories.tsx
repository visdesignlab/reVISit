import React from "react";
import { storiesOf } from "@storybook/react";
import * as d3 from "d3";
import {
  unrelativeProvenanceData,
  relativeProvenanceData,
} from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

const stories = storiesOf("ProvGraphs", module);
stories.addDecorator(withKnobs);
/*stories.add("with a button", () => {
  const style = {
    backgroundColor: "#FFF",
    border: "1px solid #DDD",
    borderRadius: 2,
    outline: 0,
    fontSize: 15,
    cursor: "pointer",
  };
  return (
    <button disabled={boolean("Disabled", true)} style={{ Style: style }}>
      {text("Label", "Hello Button")}
    </button>
  );
});*/
let xScale = d3.scaleTime().range([5, 200 - 5]);
// set domains, needs to take in axis from parent to scale all
xScale.domain([0, 1]);
stories.add("small", () => {
  let isDataRelative = boolean("Relative", true);
  let renderIcons = boolean("Icons", true);

  console.log(
    "KNOB",
    isDataRelative,
    relativeProvenanceData,
    unrelativeProvenanceData
  );
  return (
    <div>
      {isDataRelative &&
        relativeProvenanceData.map((provTask) => (
          <div>
            {provTask.map((provRound) => {
              return (
                <ProvenanceGraph
                  provenanceGraph={provRound}
                  xScale={xScale}
                  renderIcons={renderIcons}
                />
              );
            })}
          </div>
        ))}
      {!isDataRelative &&
        unrelativeProvenanceData.map((provTask) => (
          <div>
            {provTask.map((provRound) => {
              return (
                <ProvenanceGraph
                  provenanceGraph={provRound}
                  xScale={xScale}
                  renderIcons={renderIcons}
                />
              );
            })}
          </div>
        ))}
    </div>
  );
});
