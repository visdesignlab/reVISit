import React from "react";
import { storiesOf } from "@storybook/react";
import * as d3 from "d3";
import {
  unrelativeProvenanceData,
  relativeProvenanceData,
} from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";
import {
  withKnobs,
  text,
  boolean,
  number,
  optionsKnob as options,
} from "@storybook/addon-knobs";
const label = "Tasks";
const valuesObj = {
  task1: "Task 1",
  task2: "Task 2",
  task3: "Task 3",
  task4: "Task 4",
  task5: "Task 5",
  task6: "Task 6",
  task7: "Task 7",
  task8: "Task 8",
  task9: "Task 9",
};
const defaultValue = "Task 1";

const optionsObj = {
  display: "multi-select",
};

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
  let collapseEvents = boolean("Collapse Events", true);
  let renderIcons = boolean("Icons", true);
  const groupId = "GROUP-ID1";

  let taskValue = options(label, valuesObj, defaultValue, optionsObj, groupId);

  function transpose(data) {
    return data[0].map((col, i) => data.map((row) => row[i]));
  }

  if (!Array.isArray(taskValue)) {
    taskValue = [taskValue];
  }

  let indexToAdd = taskValue.map((value) => {
    let matches = value.match(/\d+/g);
    return parseInt(matches[0]) - 1;
  });

  console.log("filter to index", indexToAdd);
  let tempRelativeProvenanceData = relativeProvenanceData.filter(
    (data, index) => {
      console.log(index, indexToAdd);
      return indexToAdd.includes(index);
    }
  );
  console.log("relative prov data", relativeProvenanceData);
  let tempUnrelativeProvenanceData = unrelativeProvenanceData.filter(
    (data, index) => indexToAdd.includes(index)
  );

  return (
    <div>
      {isDataRelative &&
        transpose(tempRelativeProvenanceData).map((provTask, index) => (
          <div>
            {provTask.map((provRound) => {
              return (
                <ProvenanceGraph
                  provenanceGraph={provRound}
                  xScale={xScale}
                  renderIcons={renderIcons}
                  collapseEvents={collapseEvents}
                />
              );
            })}
          </div>
        ))}
      {!isDataRelative &&
        transpose(tempUnrelativeProvenanceData).map((provTask) => (
          <div>
            {provTask.map((provRound) => {
              return (
                <ProvenanceGraph
                  provenanceGraph={provRound}
                  xScale={xScale}
                  renderIcons={renderIcons}
                  collapseEvents={collapseEvents}
                />
              );
            })}
          </div>
        ))}
    </div>
  );
});
