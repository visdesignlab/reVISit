import React from "react";
import { Button } from "antd";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventLayers from "../components/EventLayers";
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  EllipsisOutlined,
} from "@ant-design/icons";
import TextField from "@material-ui/core/TextField";

const ItemNameWrapper = ({ itemName, onItemNameChange }) => {
  const [doubleClicked, setDoubleClicked] = React.useState(false);
  const [currentName, setCurrentName] = React.useState(itemName);
  return (
    <div onDoubleClick={() => setDoubleClicked(true)}>
      {doubleClicked ? (
        <div>
          <TextField
            id={itemName}
            label={itemName}
            onChange={(ev) => {
              const newName = ev.target.value;
              // do checks here to verify name is unique?
              setCurrentName(newName);
            }}
            onKeyPress={(ev) => {
              console.log(`Pressed keyCode ${ev.key}`);
              if (ev.key === "Enter") {
                onItemNameChange(currentName);
                setDoubleClicked(false);
              }
            }}
          />
        </div>
      ) : (
        <div>{currentName}</div>
      )}
    </div>
  );
};
const Overview = ({ location }) => {
  let newData = relativeProvenanceData[0].map((dataArr) => {
    return { provGraph: dataArr };
  });
  // this is a mock for longer data sets w/ more participants.
  for (let i = 0; i < 0; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }

  //iterate through and create list of unique events;
  let allEvents = [];

  newData.map((d) =>
    d.provGraph.nodes.map((n) => {
      allEvents.push(n.event);
    })
  );

  function handleDataUpdate(key, newValue) {
    // in here, put the code to reorganize and set the data.
  }

  allEvents = [...new Set(allEvents)].map((d) => {
    return {
      title: () => (
        <ItemNameWrapper
          itemName={d}
          onItemNameChange={(name) => console.log("to change", name)}
        />
      ),

      key: d,
      icon: <EyeTwoTone />,
      children: ["Alex", "Lane", "Jeff", "Noeska"].map((t) => {
        return {
          title: () => {
            return <div className={"bonkers"}>{d + "_" + t}</div>;
          },
          key: d + "_" + t,
          icon: <EyeTwoTone />,
          children: [],
        };
      }),
    };
  });

  // {"title": "0-0", "key": "0-0", "children":

  console.log("allEvents", allEvents);
  // return <Button type="primary">This is an Ant Button</Button>;
  return <EventLayers gData={allEvents} />;
};

export default Overview;
