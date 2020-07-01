import React from "react";
import { Input } from 'antd';
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventAccordion from "../components/EventAccordion";
import EcoIcon from '@material-ui/icons/Eco';
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  MenuOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  PlusSquareOutlined,
  FileOutlined,
  FileAddOutlined

} from "@ant-design/icons";


const { Search } = Input;

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

  allEvents = [...new Set(allEvents)].map((d) => {
    return {
      // title: () => (
      //   <ItemNameWrapper
      //     itemName={d}
      //     itemIcon={<EcoIcon />}
      //     onItemNameChange={(name) => console.log("to change", name)}
      //   />
      // ),
      label: d,
      key: d,
      type: 'nativeEvent',
      count: Math.random(),
      children: ["Alex", "Lane", "Jeff", "Noeska"].map((t) => {
        return {
          title: () => {
            return <div className={"bonkers"}>{d + "_" + t}</div>;
          },
          key: d + "_" + t,
          label: t,
          icon: <EyeTwoTone />,
          count: Math.random(),
          type: 'nativeEvent',
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
        // title: () => (
        //   <ItemNameWrapper
        //     itemName={value}
        //     itemIcon={<FileAddOutlined />}
        //     onItemNameChange={handleDataUpdate}
        //   />
        // ),
        label: value,
        type: 'customEvent',
        key: value,
        children: []
      };
      const newData = [newEvent, ...data]
      setData(newData);
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
      <EventAccordion data={data} onChange={setData} />
    </div>
  </div >;
};

export default Overview;
