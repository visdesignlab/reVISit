import React from "react";
import { Input } from "antd";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventAccordion from "../components/EventAccordion";
import EcoIcon from "@material-ui/icons/Eco";
import { PlusSquareOutlined } from "@ant-design/icons";

import CollapsibleTable from '../components/EventTable'
import * as d3 from "d3";

let allData = require(`../common/data/provenance_summary.json`);

//wrangle data into provenance first format: 
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

      provDict[eventName] ? provDict[eventName].instances.push(instance) : provDict[eventName] = { instances: [instance] };

    })

  })

  // [{'event':'eventName', instances:[]}]
});

//map each event to a numeric index for sequence matching
let allEvents = Object.keys(provDict);
allEvents.map((k, i) => {
  provDict[k].index = i;
})

let sequences = [];
//create sequence arrays
allData.map(p => {
  let id = p.id;
  let keys = Object.keys(p.data);
  //tasks are objects that have a provenance array
  let tasks = keys.filter(k => p.data[k].provenance);
  tasks.map(taskID => {
    let task = p.data[taskID];
    let user_task_seq = [];
    task.provenance.map((event, i) => {
      let eventName = event.event
      let eventNumber = provDict[eventName].index;
      user_task_seq.push(eventNumber)
    })

    //remove duplicates
    let nodups = user_task_seq.filter(function (item, pos, arr) {
      // Always keep the 0th element as there is nothing before it
      // Then check if each element is different than the one before it
      return pos === 0 || item !== arr[pos - 1];
    });


    // 

    sequences.push({ task, seq: user_task_seq, sum_seq: nodups });
  })
})




let seq = sequences.filter(s => s.task.visType == 'adjMatrix' && s.task.taskID == 'S-task16')

// async function patternCount(sequence, seqField) {
console.log('calling patternCount')
let output;

// d3.json('http://127.0.0.1:5000/prefix', {
d3.json('http://18.222.101.54//prefix', {


  method: "POST",
  body: JSON.stringify(seq.map(s => s['sum_seq'])),
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then(array => {

    array.map(a => {
      if (a[1][1] == a[1][2]) {
        console.log('found a duplicate')
        console.log(a[1])
      }

    })



    let results = array.sort((a, b) => a[0] > b[0] ? 1 : -1).map(arr => {
      return [arr[0], arr[1].map(e => allEvents[e])]
    })
    console.log(allEvents, results)
  });

// return output

// }


// console.log(JSON.stringify(sequences['S-task01']))


// console.log(sequences)


// console.log(allData, provDict)
//filter out sequences according to any taskInfo (id, accuracy, visType, etc..)



// d3.json("http://127.0.0.1:5000/test").then(
//   function (d) {

//   })



const { Search } = Input;

const Overview = async ({ location }) => {
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



  // let out = await patternCount(seq, 'seq');
  // console.log(out)


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



  return (<div style={{ padding: "15px" }}>
    <Search
      placeholder="Create Event Type"
      enterButton={<PlusSquareOutlined />}
      size="large"
      onSearch={newEvent}
      // onChange={event => setSearch(event.target.value)}
      style={{ width: 672 }}
    // value={search}
    />
    <div style={{ 'paddingTop': "15px" }}>
      <CollapsibleTable data={data} onChange={setData} />
      {/* <EventAccordion data={data} onChange={setData} /> */}
    </div>
  </div>)
};

export default Overview;
