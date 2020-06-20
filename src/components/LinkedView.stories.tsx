import React from "react";
import { storiesOf } from "@storybook/react";
import LinkedView from "./LinkedView";
storiesOf("LinkedView", module).add("medium", () => (
  <LinkedView data={[10, 20, 40, 80, 160, 320]} />
));
