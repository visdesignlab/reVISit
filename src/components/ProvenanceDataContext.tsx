import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import initProvData from "../common/data/provenance_summary.json";
import prefixSpanSampleData from "../common/data/prefix_span_sample_data.json";
import * as d3 from "d3";
import _ from "lodash";
import { performPrefixSpan } from "../fetchers/fetchMocks.js";
import { useFetchAPIData } from "../hooks/hooks";

const ProvenanceDataContext = React.createContext({});

export const ProvenanceDataContextProvider = ({ children }) => {
  const [allProvenanceData, setAllProvenanceData] = useState(
    processRawProvenanceData(initProvData)
  );

  const [events, setEvents] = useState(
    extractNativeEvents(allProvenanceData)
  );

  console.log('events are ', events)
  const [selectedTaskId, setSelectedTaskId] = React.useState("S-task01");

  const [patternsForTask, setPatternsForTask] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {

  //     let patternObj = {};

  //     Object.keys(allEvents).map(k => {
  //       patternObj[k] = { nlPatterns: [], amPatterns: [] }
  //     });



  //     Promise.all(allEvents.map(async (ev) => {
  //       let nodeLink = ev.sequences.filter(s => s.visType == 'nodeLink');
  //       let adjMatrix = ev.sequences.filter(s => s.visType == 'adjMatrix');

  //       // You can await here
  //       const nlPatterns = await getPatterns(nodeLink,events);
  //       const amPatterns = await getPatterns(adjMatrix,events);

  //       patternObj[ev.event] = { nlPatterns, amPatterns }

  //     }))

  //       .then(() => {
  //         // patternObj['all'] = sequences;
  //         setPatterns(patternObj);
  //         console.log('patternObj', patternObj)

  //       })
  //     // ...
  //   }
  //   fetchData();

  //   // put code in here to re-run on any update to selectedTaskId
  //   //promise
  //   //.then
  //   // setPatternsForTask
  // }, [selectedTaskId])

  /*const [loadingPatterns, errorLoadingPatterns,patternsFromServer] = useFetchAPIResponse(
    async ()=>{
      return await getPatternsFromServer()
    },
    [selectedTaskId]
  )

  useEffect(()=>{
    setPatternsForTask(patternsFromServer)
  },[patternsFromServer])*/




  const taskStructure = [
    { name: "Task 1", key: "S-task01", prompt: "" },
    { name: "Task 2", key: "S-task02" },
    { name: "Task 3", key: "S-task03" },
    { name: "Task 4", key: "S-task04" },
    { name: "Task 5", key: "S-task05" },
    { name: "Task 6", key: "S-task06" },
    { name: "Task 7", key: "S-task07" },
    { name: "Task 8", key: "S-task08" },
    { name: "Task 9", key: "S-task09" },
    { name: "Task 10", key: "S-task10" },
    { name: "Task 11", key: "S-task11" },
    { name: "Task 12", key: "S-task12" },
    { name: "Task 13", key: "S-task13" },
    { name: "Task 14", key: "S-task14" },
    { name: "Task 15", key: "S-task15" },
    { name: "Task 16", key: "S-task16" },
  ];

  //create state that maps events (including user created ones) to their children and a numeric index (for sequence mapping) 

  function extractNativeEvents(data) {
    let events = [];
    data.map(participant => {
      let userData = participant.data
      //tasks are objects that contain a provenance field.
      let tasks = Object.keys(userData).filter(k => userData[k].provenance);
      tasks.map(task => {
        userData[task].provenance.map(e => {
          events.push(e.event)
        })
      })
    });

    events = [... new Set(events)];
    events = events.map((e, i) => ({ event: e, children: [], id: i }));
    return events;
  }

  //async function to grab data from server; 
  async function getPatterns(seq, eventNames) {

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
        count: arr[0], seq: arr[1].map(e => ({ event: eventNames.find(ev => ev.id == e).event }))
      })
    })
    return results
  }

  function handleChangeSelectedTaskId(event) {
    setSelectedTaskId(event.target.value);
  }

  let currentTaskData = React.useMemo(() => {
    let internalTaskData = [];
    allProvenanceData.forEach((participant) => {
      const newObj = Object.assign(
        { id: participant.id },
        participant.data[selectedTaskId]
      );

      if (participant.data[selectedTaskId]) {
        internalTaskData.push(newObj);
      }
    });
    return internalTaskData;
  }, [allProvenanceData, selectedTaskId]);

  const [isLoading, isError, data] = useFetchAPIData(async () => {
    const sampleData = prefixSpanSampleData.data;
    console.log(sampleData);
    return await performPrefixSpan(sampleData);
  }, [currentTaskData]);
  console.log("check out the prefix span data", isLoading, isError, data);
  // console.log("relative", allProvenanceData);
  return (
    <ProvenanceDataContext.Provider
      value={{
        allProvenanceData,
        currentTaskData,
        taskStructure,
        handleChangeSelectedTaskId,
        selectedTaskId,
      }}>
      {children}
    </ProvenanceDataContext.Provider>
  );
};


function calculateRelativeProvGraph(taskPerformance, maxTime) {
  let totalTime =
    new Date(taskPerformance.endTime) - new Date(taskPerformance.startTime);
  let scale = maxTime / totalTime;
  taskPerformance["totalTime"] = totalTime;
  taskPerformance["relativeStartTime"] = 0;
  taskPerformance["relativeStopTime"] = 1 / scale;
  if (taskPerformance["provenance"]) {
    taskPerformance["provenance"] = taskPerformance["provenance"].map(
      (node) => {
        node["percentTime"] =
          (new Date(node["time"]) - new Date(taskPerformance["startTime"])) /
          totalTime;
        node["relativeTime"] = node["percentTime"] / scale;

        return node;
      }
    );
  } else {
    taskPerformance["provenance"] = [];
  }

  return taskPerformance;
}
function processRawProvenanceData(unrelativeProvenanceData) {
  const taskIds = [
    "S-task01",
    "S-task02",
    "S-task03",
    "S-task04",
    "S-task05",
    "S-task06",
    "S-task07",
    "S-task08",
    "S-task09",
    "S-task10",
    "S-task11",
    "S-task12",
    "S-task13",
    "S-task14",
    "S-task15",
    "S-task16",
  ];

  const relativeProvenanceData = _.cloneDeep(unrelativeProvenanceData);
  taskIds.forEach((taskId) => {
    let longestTimeForTask = d3.max(unrelativeProvenanceData, (participant) => {
      if (
        participant.data &&
        participant.data[taskId]?.startTime &&
        participant.data[taskId]?.endTime
      ) {
        return (
          new Date(participant.data[taskId].endTime) -
          new Date(participant.data[taskId].startTime)
        ); // minutes->seconds->ms
      }
      return 0;
    });
    // console.log("longest time", longestTimeForTask);
    unrelativeProvenanceData.forEach((participant, index) => {
      if (participant.data && participant.data[taskId]) {
        relativeProvenanceData[index].data[taskId] = calculateRelativeProvGraph(
          participant.data[taskId],
          longestTimeForTask
        );
      } else {
        delete relativeProvenanceData[index][taskId];
        // console.log("NO DATA", relativeProvenanceData[index], taskId);
      }
    });
  });

  //add label and 'origEvent' fields to provenance; 


  return relativeProvenanceData;
}

// function computeSequences(){

// }

export default ProvenanceDataContext;
