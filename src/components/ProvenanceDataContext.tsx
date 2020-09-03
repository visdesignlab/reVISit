//@ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import * as d3 from "d3";
import _ from "lodash";
import {
  getDataFromServer,
  getTaskDataFromServer,
} from "../fetchers/fetchMocks.js";
import { useFetchAPIData } from "../hooks/hooks";
import { eventMappingList } from "./eventMapping";

function addIdsToNodes(nodes) {
  return nodes.map((node, index) => {
    let dataObject;
    if (index % 10 === 0) {
      dataObject = { dataID: "3c9ea11f-2a0b-46ee-9dc0-835d12561281" };
    } else if (index % 10 === 1) {
      dataObject = { dataID: "e3798172-df56-4124-8326-435b81ccb7a5" };
    } else if (index % 10 === 2) {
      dataObject = { dataID: "02a5a389-bc6b-4747-a1fb-f722158c66c6" };
    } else if (index % 10 === 3) {
      dataObject = { dataID: "698c9c66-63d5-4447-a4e6-7ba05e4aa5e9" };
    } else if (index % 10 === 4) {
      dataObject = { dataID: "74ed9ecf-e77b-4f45-8831-db220f5e2057" };
    } else if (index % 10 === 5) {
      dataObject = { dataID: "29c7a143-eac6-405e-ae66-e650754bb525" };
    } else if (index % 10 === 6) {
      dataObject = { dataID: "c78a8578-a5fc-411b-bb20-a6ebf9702273" };
    } else if (index % 10 === 7) {
      dataObject = { dataID: "f822c69d-1a7f-460a-80d5-58d24082fcfa" };
    } else if (index % 10 === 8) {
      dataObject = { dataID: "ff77ab34-ace1-498e-9367-beb4b72c9ea6" };
    } else {
      dataObject = { dataID: "1de36df0-5bf8-48a8-ad37-17641ada498f" };
    }
    return Object.assign(node, dataObject);
  });
}
let nodes1 = [
  { id: "49607", name: "startedProvenance", time: 0 },
  { id: "49608", name: "sort", time: 0.133333 },
  { id: "49609", name: "sort", time: 0.15 },
  { id: "49610", name: "sort", time: 0.183333 },
  { id: "49611", name: "sort", time: 0.2 },
  { id: "49612", name: "sort", time: 0.216667 },
  { id: "49613", name: "sort", time: 0.233333 },
  { id: "49614", name: "search", time: 0.566667 },
  { id: "49615", name: "answerBox", time: 0.716667 },
  { id: "49616", name: "Finished Task", time: 0.733333 },
];
const commonProps = {
  condition: "nodeLink",
  taskId: "S-task13",
  participantId: "545d6768fdf99b7f9fca24e3",
};

const ProvenanceDataContext = React.createContext({});
function compileActionListToHashTable(list) {
  let newActionObject = {};
  list.forEach((item) => {
    let newObject = {};
    newObject[item.id] = item;
    Object.assign(newActionObject, newObject);
  });
  return newActionObject;
}
export const ProvenanceDataContextProvider = ({ children }) => {
  // console.trace('calling provenanceDataContextProvider')
  const [selectedTaskIds, setSelectedTaskIds] = React.useState(["S-task01"]);
  const [actionConfigurations, setActionConfigurations] = useState();
  const [actionConfigurationsList, setActionConfigurationsList] = useState(
    eventMappingList
  );

  useEffect(() => {
    setActionConfigurations(
      compileActionListToHashTable(actionConfigurationsList)
    );
  }, [actionConfigurationsList]);

  const taskStructure = [
    { name: "Task 1", key: "S-task01", prompt: "", actions: {}, stats: {} },
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

  let [data, setData] = useState();
  const [currentlyVisitedNodes, setCurrentlyVisitedNodes] = React.useState(
    null
  );
  // const [metrics,setMetrics] = React.useState()

  let conditions;
  let metrics;

  if (data) {
    conditions = data.conditions;
    metrics = data.metrics;
  }

  let [homeTaskSort, setHomeTaskSort] = useState();

  function handleProvenanceNodeClick(id) {
    console.log("dywootto handle provenance node click", id);

    // hardcoded data for now. ideally, we'll have the event id to be able to select on.
    const taskId = selectedTaskIds[0];
    const participantId = "545d6768fdf99b7f9fca24e3";
    const taskNumber = 1;
    const currentlyVisitedProvInfo = {
      data: addIdsToNodes(nodes1),
      props: commonProps,
    };
    console.log("about to set visited", currentlyVisitedProvInfo);
    setCurrentlyVisitedNodes(currentlyVisitedProvInfo);

    // select all of that provenance graph.
    //const promise = mysql_api(`/actions/${participantId}/${taskId}`);

    //promise.then((resolved) => {
    //  console.log("resolvedclick", resolved);
    //alert(`queried (skinny) provenance from db ${resolved.data}`);

    // rehydrate provenance graph
    // render vis using that provenance graph
    //});
  }
  // get initial data from server;
  let [isLoading, isError, dataFromServer] = useFetchAPIData(async () => {
    return await getDataFromServer();
  }, []);
  // console.log(isLoading, isError, dataFromServer);
  /*[{"_id":"startedProvenance","actionID":"startedProvenance","category":"Study\r","condition":"nodeLink","elapsedTime":0,"id":1,"label":"Start Task","participantID":"545d6768fdf99b7f9fca24e3","target":null,"taskID":"S-task01","time":"Wed, 28 Aug 2019 00:51:18 GMT","type":"action"},{"_id":"Hard Selected A Node","actionID":"Hard Selected a Node","category":"Answer\r","condition":"nodeLink","elapsedTime":0.283333,"id":2,"label":"Select","participantID":"545d6768fdf99b7f9fca24e3","target":null,"taskID":"S-task01","time":"Wed, 28 Aug 2019 00:51:35 GMT","type":"action"},{"_id":"Hard Unselected A Node","actionID":"Hard Unselected a Node","category":"Answer\r","condition":"nodeLink","elapsedTime":0.316667,"id":3,"label":"Unselect","participantID":"545d6768fdf99b7f9fca24e3","target":null,"taskID":"S-task01","time":"Wed, 28 Aug 2019 00:51:37 GMT","type":"action"},{"_id":"Hard Selected A Node","actionID":"Hard Selected a Node","category":"Answer\r","condition":"nodeLink","elapsedTime":0.45,"id":2,"label":"Select","participantID":"545d6768fdf99b7f9fca24e3","target":null,"taskID":"S-task01","time":"Wed, 28 Aug 2019 00:51:45 GMT","type":"action"},{"_id":"Finished Task","actionID":"Finished Task","category":"Study\r","condition":"nodeLink","elapsedTime":0.666667,"id":4,"label":"Finish Task","participantID":"545d6768fdf99b7f9fca24e3","target":null,"taskID":"S-task01","time":"Wed, 28 Aug 2019 00:51:58 GMT","type":"action"}]*/

  useEffect(() => {
    console.log("data from server", dataFromServer);
    setData(dataFromServer);
  }, [dataFromServer]);

  //State
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleTagCreation = async (participantID, taskID, tag, action) => {
    await timeout(200);

    return tag;
  };
  let [taskSort, setTaskSort] = useState("name");

  /*const [allProvenanceData, setAllProvenanceData] = useState(() =>
    processRawProvenanceData(initProvData)
  );*/

  const [currentTaskData, setCurrentTaskData] = React.useState([]);

  let [
    isTaskLoading,
    isTaskError,
    taskDataFromServer,
  ] = useFetchAPIData(async () => {
    console.log("dywootto getTaskData", selectedTaskIds);
    const response = await getTaskDataFromServer(selectedTaskIds[0]);
    response.data = response.data.map((datum) => {
      // console.log(datum.sequence);
      try {
        datum.sequence = JSON.parse(`[${datum.sequence}]`);
      } catch (err) {
        console.error(
          `[Provenance Data Context] Error Parsing ${datum.participantID}'s event sequence. This is likely caused by the sequence being > 16k characters.`
        );
        datum.sequence = [];
      }
      return datum;
    });
    return response;
  }, [selectedTaskIds]);

  useEffect(() => {
    setCurrentTaskData(taskDataFromServer);
  }, [taskDataFromServer]);

  function handleChangeSelectedTaskId(event) {
    setSelectedTaskIds([event.target.value]);
  }

  return (
    <ProvenanceDataContext.Provider
      value={{
        currentTaskData,
        taskStructure,
        handleChangeSelectedTaskId,
        selectedTaskIds,
        data,
        metrics,
        setTaskSort,
        homeTaskSort,
        setHomeTaskSort,
        conditions,
        handleTagCreation,
        handleProvenanceNodeClick,
        currentlyVisitedNodes,
        setCurrentlyVisitedNodes,
        actionConfigurations,
        setActionConfigurationsList,
        actionConfigurationsList,
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
  //remove element with no data
  unrelativeProvenanceData = unrelativeProvenanceData.filter(
    (d) => Object.keys(d.data).length > 0
  );

  //remove elements with no, or messed up provenance (more than one started prov event)
  unrelativeProvenanceData = unrelativeProvenanceData.filter((d) => {
    let tasks = Object.keys(d.data).filter((t) => t.includes("task"));

    return tasks.reduce((acc, task) => {
      if (!d.data[task].provenance) {
        //participant has no provenance for a certain task.
        return false;
      } else {
        //element has more than on 'startedProvenance' event in the same task.
        return (
          acc &&
          d.data[task].provenance.filter((p) => p.event == "startedProvenance")
            .length == 1
        );
      }
    }, true);
  });

  // console.trace('calling process Raw prov data')
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
        //create id field in each provenance event (that doesn't change with edits)
        participant.data[taskId].provenance.map((p) => (p.id = p.event));
      } else {
        delete relativeProvenanceData[index][taskId];
        // console.log("NO DATA", relativeProvenanceData[index], taskId);
      }
    });
  });

  return relativeProvenanceData;
}

export default ProvenanceDataContext;
