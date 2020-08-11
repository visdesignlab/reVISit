//@ts-nocheck
import React from "react";
import {
  Plugin,
  Template,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
const pluginDependencies = [{ name: "TableGroupRow" }];
export const GroupedRowPlug = (props) => {
  console.log(props);
  return (
    <Plugin name="GroupRow" dependencies={pluginDependencies}>
      <Template name="groupRowContent">
        <TemplatePlaceholder />
        <p>This is a secondary row</p>
      </Template>
    </Plugin>
  );
};
