import React from "react";
import { storiesOf } from "@storybook/react";
import ChartGenerator from "./ChartGenerator";
storiesOf("ChartGenerator", module).add("small", () => (
  <ChartGenerator data={[20, 34, 80, 112]} />
));
