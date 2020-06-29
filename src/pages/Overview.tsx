import React from "react";
import { Input } from 'antd';
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventLayers from "../components/EventLayers";
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  MenuOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  PlusSquareOutlined

} from "@ant-design/icons";
import TextField from "@material-ui/core/TextField";
import { getAllJSDocTags } from "typescript";


const { Search } = Input;
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
          <div>{currentName}  <EyeTwoTone />  <AppstoreOutlined /></div>
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
      // icon: <EyeTwoTone />,
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

  const [data, setData] = React.useState(allEvents);

  function newEvent(value) {
    {
      console.log('new Event is', value)
      let newEvent = {
        title: () => (
          <ItemNameWrapper
            itemName={value}
            onItemNameChange={(name) => console.log("to change", name)}
          />
        ),

        key: value,
        children: []
      };
      const newData = [...data, newEvent]
      // data.push(newEvent)
      setData(newData);
      // console.log('new data is ', data)
    }
  }


  return <div style={{ padding: "15px" }}>
    <Search
      placeholder="Create Event Type"
      enterButton={<PlusSquareOutlined />}
      size="large"
      onSearch={newEvent}
      style={{ width: 300 }}
    />
    <div style={{ 'paddingTop': "15px" }}>
      <EventLayers data={data} onChange={setData} />
    </div>
  </div >;
};

export default Overview;
