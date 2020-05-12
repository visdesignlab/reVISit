import React from "react";
import { storiesOf } from "@storybook/react";
import CircleGenerator from "./CircleGenerator";
storiesOf("CircleGenerator", module)
  .add("small", () => <CircleGenerator data={[20, 34, 80, 112]} />)
  .add("large", () => <CircleGenerator data={[20, 67, 89, 212]} />);
