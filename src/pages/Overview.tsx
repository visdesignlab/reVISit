import React, { useContext } from "react";
import { Input } from "antd";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventAccordion from "../components/EventAccordion";
import Event_Layers from "../components/Event_Layers";

import EcoIcon from "@material-ui/icons/Eco";
import { PlusSquareOutlined } from "@ant-design/icons";

import CollapsibleTable from '../components/EventTable'
import * as d3 from "d3";
import ProvenanceDataContext from "../components/ProvenanceDataContext";

function removeDuplicates(arr) {
  return arr.filter(function (item, pos, arr) {
    // Always keep the 0th element as there is nothing before it
    // Then check if each element is different than the one before it
    return pos === 0 || item !== arr[pos - 1];
  });
}

const { Search } = Input;

const Overview = ({ location }) => {

  const { currentTaskData } = useContext(ProvenanceDataContext);

  let provDict = {};

  currentTaskData.map((data) => {
    let lastAction;

    data.provenance.map((event, i) => {
      let eventName = event.event;
      let instance = {
        event: eventName,
        taskID: data.taskID,
        participantID: data.workerID,
        condition: data.visType,
        time: event.time,
        target: [],
        actionBefore: i > 0 ? lastAction : undefined,
        actionAfter: undefined,
        taskAccuracy: data.answer.accuracy,
        taskMinutes: data.minutesToComplete,
      };

      if (lastAction) {
        lastAction.actionAfter = instance;
      }
      lastAction = instance;

      if (!provDict[eventName]) {
        provDict[eventName] = { sequences: [], instances: [] }
      }

      provDict[eventName].instances.push(instance)

    })
  });



  console.log(provDict)

  //map each event to a numeric index for sequence matching
  let eventNames = Object.keys(provDict).map((k, i) => ({
    name: k, index: i
  }))

  console.log(eventNames)


  let sequences = [];
  //create sequence arrays
  currentTaskData.map(data => {
    let user_task_seq = [];

    data.provenance.map((event, i) => {
      let eventName = event.event
      let eventNumber = eventNames.find(e => e.name == eventName).index;
      user_task_seq.push(eventNumber)
    })

    //remove duplicates
    let nodups = removeDuplicates(user_task_seq);
    let seqObj = { visType: data.visType, task: data.taskID, seq: user_task_seq, sum_seq: nodups }
    sequences.push(seqObj);

    //remove duplicates to iterate through unique provenance events
    let uniqueProvenance = removeDuplicates(data.provenance.map(p => p.event));
    uniqueProvenance.map(eventName => {
      provDict[eventName].sequences.push(seqObj)
    })


  })

  //double check provDict.sequences;
  Object.keys(provDict).map(key => {
    provDict[key].sequences.map(s => {
      let eventIndex = eventNames.find(e => e.name == key).index
      if (!s.seq.includes(eventIndex)) {
        console.log('we have a problem')
      }
    })
  })

  let seq = sequences;
  let allEvents = Object.keys(provDict).map((k) => {
    return {
      // title: () => (
      //   <ItemNameWrapper
      //     itemName={d}
      //     itemIcon={<EcoIcon />}
      //     onItemNameChange={(name) => console.log("to change", name)}
      //   />
      // ),
      event: k,
      key: k,
      type: "nativeEvent",
      instances: provDict[k].instances,
      sequences: provDict[k].sequences,
      count: provDict[k].instances.length,
      children: [],
      patterns: {}
    };
  });

  console.log('seq', seq)

  let data = allEvents.sort((a, b) => (a.count > b.count ? -1 : 1));
  // const [data, setData] = React.useState(
  //   allEvents.sort((a, b) => (a.count > b.count ? -1 : 1))
  // );

  const [patterns, setPatterns] = React.useState({})
  const [search, setSearch] = React.useState("");

  async function getPatterns(seq) {

    let array = await d3.json('http://127.0.0.1:5000/prefix', {
      // d3.json('http://18.222.101.54/prefix', {
      method: "POST",
      body: JSON.stringify(seq.map(s => s['seq'])),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    let results = array.sort((a, b) => a[0] > b[0] ? 1 : -1).map(arr => {
      return ({
        count: arr[0], seq: arr[1].map(e => ({ event: eventNames.find(ev => ev.index == e).name }))
      })
    })
    return results
  }

  //fetch the pattern data once the component has mounted
  React.useEffect(() => {
    async function fetchData() {

      let patternObj = {};

      Object.keys(allEvents).map(k => {
        patternObj[k] = { nlPatterns: [], amPatterns: [] }
      });



      Promise.all(allEvents.map(async (ev) => {
        let nodeLink = ev.sequences.filter(s => s.visType == 'nodeLink');
        let adjMatrix = ev.sequences.filter(s => s.visType == 'adjMatrix');

        // You can await here
        const nlPatterns = await getPatterns(nodeLink);
        const amPatterns = await getPatterns(adjMatrix);

        patternObj[ev.event] = { nlPatterns, amPatterns }

      }))

        .then(() => {
          // patternObj['all'] = sequences;
          setPatterns(patternObj);
          console.log('patternObj', patternObj)

        })
      // ...
    }
    fetchData();


    console.log('useEffect')

  }, currentTaskData);




  function newEvent(value) {
    {
      setSearch("");
      console.log("new Event is", value);
      let newEvent = {
        event: value,
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

  let patternComponent
  if (Object.keys(patterns).length > 0) {
    console.log('patterns are ', patterns)
    // patternComponent = 'loading'

    patternComponent = <EventAccordion data={data} patterns={patterns} />
    // patternComponent = <EventAccordion data={data} patterns={patterns} onChange={setData} />

  } else {
    patternComponent = 'loading'
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
      {patternComponent}

      {/* <CollapsibleTable data={data} onChange={setData} /> */}
      {/* <EventAccordion data={data} onChange={setData} /> */}
    </div>
  </div>)
};

export default Overview;
