//import allProvenanceData from "./allProvenanceMocks.js";
//import task1Data from './task1ProvData.js'l
import * as d3 from "d3";
import _ from "lodash";
let taskIds = [
  "S-task01",
  "S-task02",
  "S-task03",
  "S-task04",
  "S-task05",
  "S-task06",
  "S-task07",
  "S-task08",
  "S-task09",
  "S-task010",
  "S-task011",
  "S-task012",
];

let allTaskData = [];
for (let i = 0; i < taskIds.length; i++) {
  allTaskData.push(require(`./taskPartitioned/${taskIds[i]}.json`));
}
//S - task01;
//const allProvenanceData = [allData];
let provDataForTask = [];
let provset = new Set();

export const trimProvDataArr = (currentTaskData, filter) => {
  let unrelativeProvenanceData = [],
    relativeProvenanceData = [];
  let filteredTask = currentTaskData;
  console.log(currentTaskData);
  if (filter) {
    filteredTask = filteredTask.filter((item) => {
      console.log(item.id, item.id.includes(filter), filter);
      return item.id.includes(filter);
    });
    filteredTask = filteredTask.filter((value) => {
      console.log(value.data.provGraphs);
      return value.data.provGraphs;
    });
  }
  console.log(filteredTask);

  const newVals = filteredTask.map((taskData) => {
    let forTaskFilter = taskData; //;

    /**
     * Deep diff between two object, using lodash
     * @param  {Object} object Object compared
     * @param  {Object} base   Object to compare with
     * @return {Object}        Return a new object who represent the diff
     */
    function difference(object, base) {
      function changes(object, base) {
        return _.transform(object, function (result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] =
              _.isObject(value) && _.isObject(base[key]) ?
              changes(value, base[key]) :
              value;
          }
        });
      }
      return changes(object, base);
    }

    function trimProvGraph(entireProvGraph) {
      if (!entireProvGraph || !Array.isArray(entireProvGraph)) {
        return;
      }
      let trimmedProvGraph = {};
      let startTime, stopTime;
      trimmedProvGraph["nodes"] = entireProvGraph.map(
        (provenanceNode, index) => {
          let trimmedNode = {};
          console.log("dywootto", provenanceNode);
          trimmedNode.event = provenanceNode.event ?
            provenanceNode.event :
            "startedProvenance";
          trimmedNode.time = new Date(provenanceNode.time);
          if (trimmedNode.event === "startedProvenance") {
            startTime = new Date(provenanceNode.time);
          }
          if (trimmedNode.event === "Finished Task") {
            stopTime = new Date(provenanceNode.time); //provenanceNode.time;
          }

          /**
           * Deep diff between two object, using lodash
           * @param  {Object} object Object compared
           * @param  {Object} base   Object to compare with
           * @return {Object}        Return a new object who represent the diff
           */
          function difference(object, base) {
            function changes(object, base) {
              return _.transform(object, function (result, value, key) {
                if (!_.isEqual(value, base[key])) {
                  result[key] =
                    _.isObject(value) && _.isObject(base[key]) ?
                    changes(value, base[key]) :
                    value;
                }
              });
            }
            return changes(object, base);
          }

          if (index < entireProvGraph.length && index > 0) {
            trimmedNode.target = difference(
              provenanceNode,
              entireProvGraph[index - 1]
            );
            console.log(trimmedNode.target);
          }
          // to display meta info about event target (ie node 'J_heer')
          //trimmedNode.trigger = null; // to display meta info about event trigger (ie click, drag, etc)
          provset.add(trimmedNode.event);
          console.log("dywootto", trimmedNode, trimmedNode["time"]);

          return trimmedNode;
        }
      );
      const totalTime = stopTime - startTime;
      if (isNaN(totalTime)) {
        return {
          nodes: []
        };
      }
      console.log(totalTime, stopTime, startTime);
      trimmedProvGraph["nodes"].forEach((node) => {
        node.time = (node.time - startTime) / totalTime; // relative time
        node.absoluteTime = node.time - startTime;
      });
      trimmedProvGraph["nodes"].sort((nodeA, nodeB) => nodeA.time - nodeB.time);

      trimmedProvGraph["startTime"] = (startTime - startTime) / totalTime; // 0
      trimmedProvGraph["stopTime"] = (stopTime - startTime) / totalTime; // 1
      trimmedProvGraph["totalTime"] = totalTime;
      trimmedProvGraph["correct"] = Math.random() > 0.4 ? "true" : "false"; //60% accuracy, true and false string are used to keep data inline with categorical variables.

      return trimmedProvGraph;
    }

    // find the person with longest time,
    console.log(forTaskFilter);
    return trimProvGraph(forTaskFilter.data.provGraphs);
  });
  console.log(newVals);
  let longestTime = d3.max(newVals, (d) => {
    console.log("dywoott d time", d);
    if (d && d.totalTime) {
      return d.totalTime;
    }
    return 0;
  });
  if (newVals.length === 0) {
    return;
  }
  //unrelativeProvData = unrelativeProvData.filter((data) => data?.length > 0);
  unrelativeProvenanceData = _.cloneDeep(newVals);
  console.log("longest time", longestTime);
  const createRelative = (provGraph) => {
    let scale = longestTime / provGraph.totalTime;
    provGraph["startTime"] = provGraph["startTime"] / scale;
    provGraph["stopTime"] = provGraph["stopTime"] / scale;
    provGraph["nodes"] = provGraph["nodes"].map((node) => {
      node["time"] = node["time"] / scale;

      return node;
    });
    return provGraph;
  };

  //unrelativeProvData.map();
  //if (true) {
  relativeProvenanceData = newVals.map((val) => createRelative(val));
  //} else {
  //provData = unrelativeProvData;
  //}
  //allProvData.push(provData);
  //const provData = allData.data.provGraphs;
  return [relativeProvenanceData, unrelativeProvenanceData];
};
//const val = trimProvDataArr(allTaskData[0]);
const val = [
  [],
  []
];
let unrelativeProvenanceData = val[1],
  relativeProvenanceData = val[0];
export {
  relativeProvenanceData,
  unrelativeProvenanceData
};