//@ts-nocheck
import { storiesOf } from "@storybook/react";
import React, { useState, useContext } from "react";
import { start } from "repl";
import { withKnobs, optionsKnob as options } from "@storybook/addon-knobs";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import { useEffect } from "@storybook/addons";
import ColorPicker from "material-ui-color-picker";
import TextField from "@material-ui/core/TextField";
import { IsolatedNode } from "./ProvenanceIsolatedNodes";
import ProvenanceDataContext from "./ProvenanceDataContext";
import Button from "@material-ui/core/Button";

export const ActionLegend = (props) => {
  const [actionItemBeingEdited, setActionItemBeingEdited] = useState(null);
  const { actionConfigurationsList, setActionConfigurationsList } = useContext(
    ProvenanceDataContext
  );
  function handleSaveActionConfiguration(newConfiguration) {
    const configurationIndex = actionConfigurationsList.findIndex(
      (config) => config.id === newConfiguration.id
    );
    let configCopy = [...actionConfigurationsList];
    configCopy[configurationIndex] = newConfiguration;
    setActionConfigurationsList(configCopy);
    setActionItemBeingEdited(null);
  }
  return (
    <div>
      <ActionLegendPresentational
        actionsConfigurations={actionConfigurationsList}
        handleActionItemEdit={setActionItemBeingEdited}
        collapsed={props.collapsed}></ActionLegendPresentational>
      {actionItemBeingEdited && (
        <Modal
          open={!!actionItemBeingEdited}
          onClose={() => setActionItemBeingEdited(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description">
          <EditActionForm
            actionConfiguration={actionItemBeingEdited}
            handleActionConfigurationChange={
              handleSaveActionConfiguration
            }></EditActionForm>
        </Modal>
      )}
    </div>
  );
};

class ActionConfiguration {
  constructor(icon, name, id, color) {
    this.icon = icon;
    this.name = name;
    this.id = id;
    this.color = color;
  }
}

const EditActionForm = ({
  actionConfiguration,
  handleActionConfigurationChange,
}) => {
  console.log("in edit action form", actionConfiguration);

  const [volatileConfiguration, setVolatileConfiguration] = useState(
    actionConfiguration
  );
  if (!actionConfiguration.id) {
    console.error(`action configuration is missing an id.`);
    return <div></div>;
  }
  function handleConfigurationPropertyChange(key, newValue) {
    console.log(key, newValue);
    let clonedConfiguration = JSON.parse(JSON.stringify(volatileConfiguration));
    let newConfiguration = {};
    newConfiguration[key] = newValue;

    clonedConfiguration = Object.assign(clonedConfiguration, newConfiguration);
    setVolatileConfiguration(clonedConfiguration);
  }

  return (
    <div
      style={{
        width: "300px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}>
      <div style={{ order: 0, margin: "auto" }}>
        <TextField
          value={volatileConfiguration["id"]}
          onChange={(newValue) =>
            handleConfigurationPropertyChange("id", newValue.target.value)
          }
          disabled
          id="standard-basic"
          label={"id"}
        />
      </div>
      <div style={{ order: 1, margin: "auto" }}>
        <TextField
          value={volatileConfiguration["name"]}
          onChange={(newValue) =>
            handleConfigurationPropertyChange("name", newValue.target.value)
          }
          id="standard-basic"
          label={"name"}
        />
      </div>
      <div style={{ order: 2, margin: "auto" }}>
        <label
          for={"colorPicker"}
          className={
            "MuiFormLabel-root MuiInputLabel-root MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"
          }>
          Action Color
        </label>
        <ColorPicker
          name={"colorPicker"}
          id={"colorPicker"}
          defaultValue={volatileConfiguration["color"]}
          value={volatileConfiguration["color"]}
          onChange={(newValue) => {
            handleConfigurationPropertyChange("color", newValue);
          }}></ColorPicker>
      </div>
      <div style={{ order: 2, margin: "auto" }}>
        <Button
          color="primary"
          onClick={() =>
            handleActionConfigurationChange(volatileConfiguration)
          }>
          Submit
        </Button>
        <Button
          onClick={() => handleActionConfigurationChange(actionConfiguration)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
const ActionLegendPresentational = ({
  actionsConfigurations,
  handleActionItemEdit,
  collapsed,
}) => {
  return (
    <List>
      {actionsConfigurations.map((actionConfiguration) => {
        return (
          <ListItem>
            <ActionItemNode
              collapsed={collapsed}
              actionConfiguration={actionConfiguration}
              handleActionItemEdit={handleActionItemEdit}></ActionItemNode>
          </ListItem>
        );
      })}
    </List>
  );
};
const ActionItemNode = ({
  actionConfiguration,
  handleActionItemEdit,
  collapsed,
}) => {
  return (
    <React.Fragment>
      <IsolatedNode node={{ name: actionConfiguration.id }}></IsolatedNode>
      {!collapsed && (
        <ListItemText onClick={() => handleActionItemEdit(actionConfiguration)}>
          {actionConfiguration.name}
        </ListItemText>
      )}
    </React.Fragment>
  );
};
