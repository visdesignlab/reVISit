import React from "react";
import { storiesOf } from "@storybook/react";
import Photos from "./Photo";
storiesOf("Photos", module).add("small", () => (
  <Photos url={"https://jsonplaceholder.typicode.com/photos?albumId=1"} />
));
