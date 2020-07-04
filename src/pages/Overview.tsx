import React from "react";
import { Input } from "antd";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventAccordion from "../components/EventAccordion";
import EcoIcon from "@material-ui/icons/Eco";
import { PlusSquareOutlined } from "@ant-design/icons";

let allData = require(`../common/data/provenance_summary.json`);

//wrange data into provenance first format:
let provDict = {};
let participantDict = {};

allData.map((p) => {
  let id = p.id;
  let keys = Object.keys(p.data);
  //tasks are objects that have a provenance array
  let tasks = keys.filter((k) => p.data[k].provenance);
  tasks.map((taskID) => {
    let task = p.data[taskID];
    let lastAction;
    task.provenance.map((event, i) => {
      let eventName = event.event;
      let instance = {
        event: eventName,
        taskID: task,
        participantID: id,
        condition: task.visType,
        time: event.time,
        target: [],
        actionBefore: i > 0 ? lastAction : undefined,
        actionAfter: undefined,
        taskAccuracy: task.answer.accuracy,
        taskMinutes: task.minutesToComplete,
      };

      if (lastAction) {
        lastAction.actionAfter = instance;
      }
      lastAction = instance;

      provDict[eventName]
        ? provDict[eventName].instances.push(instance)
        : (provDict[eventName] = { instances: [instance] });
    });
  });

  // [{'event':'eventName', instances:[]}]
});

console.log(allData, provDict);

const { Search } = Input;

const Overview = ({ location }) => {
  let allEvents = Object.keys(provDict).map((k) => {
    return {
      // title: () => (
      //   <ItemNameWrapper
      //     itemName={d}
      //     itemIcon={<EcoIcon />}
      //     onItemNameChange={(name) => console.log("to change", name)}
      //   />
      // ),
      label: k,
      key: k,
      type: "nativeEvent",
      instances: provDict[k].instances,
      count: provDict[k].instances.length,
      // heatMap: .map(d => ({ freq: Math.round(Math.random() * 50) })),

      children: [],
    };
  });

  const [data, setData] = React.useState(
    allEvents.sort((a, b) => (a.count > b.count ? -1 : 1))
  );
  const [search, setSearch] = React.useState("");

  function newEvent(value) {
    {
      setSearch("");
      console.log("new Event is", value);
      let newEvent = {
        label: value,
        instances: [],
        count: 0,
        type: "customEvent",
        key: value,
        // heatMap: [...Array(30).keys()].map(d => ({ freq: Math.round(Math.random() * 50) })),
        children: [],
      };
      const newData = [newEvent, ...data];
      setData(newData);
    }
  }

  return (
    <div style={{ padding: "15px" }}>
      <Search
        placeholder="Create Event Type"
        enterButton={<PlusSquareOutlined />}
        size="large"
        onSearch={newEvent}
        // onChange={event => setSearch(event.target.value)}
        style={{ width: 672 }}
        // value={search}
      />
      <div style={{ paddingTop: "15px" }}>
        <EventAccordion data={data} onChange={setData} />
      </div>
    </div>
  );
};

export default Overview;
