import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import initProvData from "../common/data/provenance_summary.json";
import * as d3 from "d3";
const ProvenanceDataContext = React.createContext({});

export const ProvenanceDataContextProvider = ({ children }) => {
  const [provenanceData, setProvenanceData] = useState(
    processRawProvenanceData(initProvData)
  );
  console.log("relative", provenanceData);
  return (
    <ProvenanceDataContext.Provider
      value={{
        provenanceData,
      }}>
      {children}
    </ProvenanceDataContext.Provider>
  );
};
function calculateRelativeProvGraph(taskPerformance, maxTime) {
  let totalTime =
    new Date(taskPerformance.endTime) - new Date(taskPerformance.startTime);
  let scale = maxTime / totalTime;
  taskPerformance["relativeStartTime"] = 0;
  taskPerformance["relativeStopTime"] = 1 / scale;
  if (taskPerformance["provenance"]) {
    taskPerformance["provenance"] = taskPerformance["provenance"].map(
      (node) => {
        node["percentTime"] =
          new Date(node["time"]) -
          new Date(taskPerformance["startTime"]) / totalTime;
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
    console.log("longest time", longestTimeForTask);
    unrelativeProvenanceData.forEach((participant) => {
      if (participant.data && participant.data[taskId]) {
        participant.data[taskId] = calculateRelativeProvGraph(
          participant.data[taskId],
          longestTimeForTask
        );
      } else {
        console.log("NO DATA", participant, taskId);
      }
    });
  });
  return unrelativeProvenanceData;
}

export default ProvenanceDataContext;
