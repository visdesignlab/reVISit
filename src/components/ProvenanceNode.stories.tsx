//@ts-nocheck
import React from "react";
import { storiesOf } from "@storybook/react";
import provData from "../common/data/provenanceMocks.js";
import ProvenanceNode from "./ProvenanceNode";
import { start } from "repl";

storiesOf("ProvNodes", module).add("small", () => {
  return (
    <svg height={200} width={200}>
      {
        <ProvenanceNode
          circle={{
            x: 50,
            y: 50,
            r: 16,
            fill: "whitesmoke",
            info: "answerBox",
          }}
        />
      }
    </svg>
  );
});
