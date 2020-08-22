//@ts-nocheck
import React from "react";
import { storiesOf } from "@storybook/react";
import BrushableHistogram, { TimeFilter } from "./TableFilters";

storiesOf("TableFilters", module).add("medium", () => (
  <TimeFilter
    data={[
      10,
      20,
      40,
      25,
      35,
      45,
      80,
      160,
      122,
      155,
      180,
      160,
      305,
      15,
      12,
      22,
      48,
      35,
      56,
      55,
      55,
      32,
      320,
    ]}
  />
));

storiesOf("TableFilters", module).add("Brush", () => {
  return (
    <BrushableHistogram
      data={[
        10,
        20,
        40,
        25,
        35,
        45,
        80,
        160,
        122,
        155,
        180,
        160,
        305,
        15,
        12,
        22,
        48,
        35,
        56,
        55,
        55,
        32,
        320,
      ]}></BrushableHistogram>
  );
});
