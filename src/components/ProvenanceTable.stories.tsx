import React from "react";
import { storiesOf } from "@storybook/react";
import * as d3 from "d3";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";
import _ from "lodash";
import {
  withKnobs,
  text,
  boolean,
  number,
  optionsKnob as options,
} from "@storybook/addon-knobs";

import MaterialTableWrapper from "./ProvenanceTable";
import { Options } from "@material-ui/core";

const stories = storiesOf("ProvTable", module);
stories.addDecorator(withKnobs);
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

const optionsObj: any = { display: "select" };
const groupId = "GROUP-ID1";

stories.add("small", () => {
  let taskValue = options(label, valuesObj, defaultValue, optionsObj, groupId);

  console.log(taskValue);
  let indexToAdd = [taskValue].map((value) => {
    let matches = value.match(/\d+/g);
    return parseInt(matches[0]) - 1;
  });
  let newData = relativeProvenanceData[indexToAdd[0]].map((dataArr) => {
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 0; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }
  return <MaterialTableWrapper provenanceData={newData} />;
});
