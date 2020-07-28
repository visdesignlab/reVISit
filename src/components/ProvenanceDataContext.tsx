import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import initProvData from "../common/data/provenance_summary.json";
import prefixSpanSampleData from "../common/data/prefix_span_sample_data.json";
import * as d3 from "d3";
import _ from "lodash";
import { performPrefixSpan } from "../fetchers/fetchMocks.js";
import { useFetchAPIData } from "../hooks/hooks";
import { ConsoleSqlOutlined } from "@ant-design/icons";


const ProvenanceDataContext = React.createContext({});

export const ProvenanceDataContextProvider = ({ children }) => {

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

  let [taskSort, setTaskSort] = useState('name');

  const [allProvenanceData, setAllProvenanceData] = useState(() => processRawProvenanceData(initProvData));

  //get all visConditions; 
  const conditions = [... new Set(allProvenanceData.map(p => p.data['S-task01'].visType))]


  let accScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 1])

  let accHistogram = d3.histogram()
    .domain(accScale.domain())
    .thresholds(accScale.ticks(10))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
    .value(d => d.answer.accuracy)

  let timeScale = d3.scaleLinear()
    .domain([0, 5]) //hard coded. need to change to dymamic
    .range([0, 5])

  let timeHistogram = d3.histogram()
    .domain(timeScale.domain())
    .thresholds(timeScale.ticks(10))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
    .value(d => d.minutesOnTask)



  //populate task prompt from data from first participant (hacky)
  let singleParticipant = allProvenanceData[0].data;


  taskStructure.map(task => {
    task.prompt = singleParticipant[task.key].prompt.replace(/(<([^>]+)>)/ig, '');;
    task.actions = {}; //singleParticipant[task.key].provenance;
    task.stats = {};
    task.histogram = {};

    conditions.map(condition => {
      //get all data for that task, for that condition; 
      let taskConditionData = allProvenanceData.filter(d => d.data[task.key].visType == condition).map(d => d.data[task.key]);
      task.actions[condition] = {};
      task.stats[condition] = {};
      task.histogram[condition] = {};

      task.histogram[condition].accuracy = accHistogram(taskConditionData)
      task.histogram[condition].time = timeHistogram(taskConditionData)

      task.stats[condition].values = taskConditionData //accHistogram(taskConditionData);


      task.stats[condition].average = {}
      task.stats[condition].average.accuracy = Math.round(d3.mean(taskConditionData.map(e => e.answer.accuracy)) * 100) / 100
      task.stats[condition].average.time = Math.round(d3.mean(taskConditionData.map(e => e.minutesOnTask)) * 100) / 100

      taskConditionData.map(d => {
        d.provenance.map(e => {
          if (task.actions[condition][e.event]) {
            task.actions[condition][e.event] = task.actions[condition][e.event] + 1;
          } else {
            task.actions[condition][e.event] = 1;
          }
        })
      })

      // task.stats[condition].accuracy = singleParticipant[task].answer.accuracy;
      // task.stats[condition].time = singleParticipant[task].minutesOnTask;
    })



  })

  //sort taskStructure according to selected option
  taskStructure.sort((a, b) => {
    if (taskSort == 'name') {
      return a.key > b.key ? 1 : -1
    }

    if (taskSort == 'accuracy') {
      let conditions = Object.keys(a.stats);
      let meanAcc_a = [];
      let meanAcc_b = [];
      conditions.map(c => meanAcc_a.push(a.stats[c].average.accuracy))
      conditions.map(c => meanAcc_b.push(b.stats[c].average.accuracy))
      return d3.mean(meanAcc_a) > d3.mean(meanAcc_b) ? -1 : 1
    }

    if (taskSort == 'time') {
      let conditions = Object.keys(a.stats);
      let meanA = [];
      let meanB = [];
      conditions.map(c => meanA.push(a.stats[c].average.time))
      conditions.map(c => meanB.push(b.stats[c].average.time))
      return d3.mean(meanA) > d3.mean(meanB) ? -1 : 1
    }

    if (taskSort == 'diff') {
      let conditions = Object.keys(a.stats);
      let diffA = Math.abs(a.stats[conditions[0]].average.accuracy - a.stats[conditions[1]].average.accuracy)
      let diffB = Math.abs(b.stats[conditions[0]].average.accuracy - b.stats[conditions[1]].average.accuracy)

      return diffA > diffB ? -1 : 1
    }


  })

  const [events, setEvents] = useState(
    listNativeEvents(allProvenanceData)
  );

  //type of edits a user can make to events: 
  //create - eventType: grouped (create a new group) 
  //rename - eventType : nativeEvent
  //move event into a group (A or B or C == newEvent) -> eventType : grouped 
  //group sequences (A then B then C == newEvent) -> eventType: sequence
  //group repetitions of the same event (A then A then A == A) -> eventType: repeated
  //hide/remove

  function hideEvent(eventName) {
    let newEvents = [...events]
    let event = newEvents.find(e => e.name == eventName);
    if (!event) {
      console.log(eventName, ' is not a valid event')
    } else {
      event.visible = !event.visible;
    }
    setEvents(newEvents)
  }

  let newEvent = function (newName) {
    let newEvent = { name: newName, type: 'group', children: [], count: 0, visible: true, id: events.length }
    setEvents([newEvent, ...events]);
    return newEvent
  }

  function renameEvent(origName, newName) {
    let newEvents = [...events]
    //modify event dictionary
    let event = newEvents.find(e => e.name == origName);
    if (!event) {
      return ('This is not a valid event')
    } else {
      event.name = newName;
    }
    setEvents(newEvents)

    //modify event instances in dictionary
    renameHelper(allProvenanceData, origName, newName);

    setAllProvenanceData(allProvenanceData)

  }

  function deleteEvent(name) {
    let newEvents = [...events]
    //modify event dictionary
    let toDelete = newEvents.find(e => e.type == 'group' && e.name == name);
    if (!toDelete) {
      return ('cannot delete event')
    } else {
      newEvents = newEvents.filter(e => e !== toDelete)
      setEvents(newEvents)
    }

    //revert event instances in dictionary
    allProvenanceData.map(participant => {
      let userData = participant.data
      //tasks are objects that contain a provenance field.
      let tasks = Object.keys(userData).filter(k => userData[k].provenance);
      tasks.map(task => {
        userData[task].provenance.map(e => {
          e.event = toDelete.children.includes(e.event) ? e.id : e.event
        })
      })
    });

    setAllProvenanceData(allProvenanceData)

  }

  function renameHelper(data, origName, newName) {
    //iterate through and rename events in allProvenance;
    data.map(participant => {
      let userData = participant.data
      //tasks are objects that contain a provenance field.
      let tasks = Object.keys(userData).filter(k => userData[k].provenance);
      tasks.map(task => {
        userData[task].provenance.map(e => {
          e.event = e.event == origName ? newName : e.event
        })
      })
    });
  }


  // group events into higher level event
  //TO DO. CANNOT SIMPLY RENAME EVENTS WHEN GROUPING SINCE IT'S HARD TO LATER UNGROUP
  function addRemoveChild(children, group) {
    let newEvents = [...events]

    //modify event dictionary
    let groupEvent = newEvents.find(e => e.name == group);
    let currentChildren = groupEvent.children;

    console.log('incoming children', children);
    console.log('currentChildren', currentChildren)
    console.log('groupEvent', groupEvent)

    let addChild = groupEvent.children.length < children.length

    if (!groupEvent) {
      return (group + ' is not a valid event')
    } else {
      if (addChild) {
        let child = children.find(value => !currentChildren.includes(value))
        let nativeEvent = newEvents.find(e => e.id == child.id);
        groupEvent.children.push(nativeEvent);
        //set nativeEvent visible
        nativeEvent.visible = false;
        //add reference to parent event 
        nativeEvent.groups.push(groupEvent);

        //iterate through and create new group events in allProvenance;
        allProvenanceData.map(participant => {
          let userData = participant.data
          //tasks are objects that contain a provenance field.
          let tasks = Object.keys(userData).filter(k => userData[k].provenance);
          tasks.map(task => {
            Object.keys(userData[task].provenance).reverse().map((i) => {
              let e = userData[task].provenance[i]
              if (e.event == nativeEvent.name) {
                //make a copy of the event and change it to a group type
                let newEvent = JSON.parse(JSON.stringify(e));
                newEvent.event = groupEvent.name;
                newEvent.id = groupEvent.name;
                newEvent.origName = nativeEvent.name

                //insert new event right after current event
                userData[task].provenance.splice(i, 0, newEvent)
              }
            })
          })
        });


      } else {
        //
        console.log('should be removing children')
        let child = currentChildren.find(value => !children.includes(value))
        let nativeEvent = newEvents.find(e => e.id == child.id);
        //set nativeEvent to visible
        nativeEvent.visible = true;
        nativeEvent.groups = nativeEvent.groups.filter(g => g.id !== groupEvent.id)
        groupEvent.children = currentChildren.filter(value => children.includes(value))

        console.log(nativeEvent, groupEvent)
        //iterate through and remove group events in allProvenance;
        allProvenanceData.map(participant => {
          let userData = participant.data
          //tasks are objects that contain a provenance field.
          let tasks = Object.keys(userData).filter(k => userData[k].provenance);
          tasks.map(task => {
            Object.keys(userData[task].provenance).reverse().map((i) => {
              let e = userData[task].provenance[i]
              if (e.name == groupEvent.name && e.origName == nativeEvent.name) {
                userData[task].provenance.splice(i, 1)
              }
            })
          })
        });

      }

      // renameHelper(allProvenanceData, child.name, groupEvent.name);

    }

    setEvents(newEvents)
    setAllProvenanceData(allProvenanceData)

  }

  function groupSequence(sequence, name) {
    let seqEvent = { name: name, type: 'sequence', children: sequence, visible: true, id: events.length - 1 }


    setEvents([...events, seqEvent])

    //modify provenance instances in data
    allProvenanceData.map(participant => {
      let userData = participant.data
      //tasks are objects that contain a provenance field.
      let tasks = Object.keys(userData).filter(k => userData[k].provenance);
      tasks.map(task => {
        let prov = userData[task].provenance //

        //ADD CODE THAT REPLACES SESQUENCES MATCHING SEQUENCE WITH SEQEVENT
      })
    });
    setAllProvenanceData(allProvenanceData)
  }


  const [selectedTaskIds, setSelectedTaskIds] = React.useState(["S-task01"]);

  const [patterns, setPatterns] = useState(null);



  //create state that maps events (including user created ones) to their children and a numeric index (for sequence mapping) 

  function listNativeEvents(data) {
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
    events = events.map((e, i) => ({ name: e, type: 'native', visible: true, groups: [], id: i }));
    return events;
  }


  function handleChangeSelectedTaskId(event) {
    setSelectedTaskIds([event.target.value]);
  }

  //count the number of events and update sequences for this task
  useEffect(() => {
    let newEvents = [...events]
    newEvents.map(e => {
      e.count = { total: 0 };
      e.sequences = {}
      conditions.map((c) => {
        e.count[c] = 0;
        e.sequences[c] = []
      }
      )
    })

    allProvenanceData.forEach((participant) => {

      selectedTaskIds.map(selectedTaskId => {
        if (participant.data[selectedTaskId]) {
          let participantData = participant.data[selectedTaskId];
          participantData.provenance
            .map(e => {
              let event = newEvents.find(ev => ev.name == e.event);
              event.count[participantData.visType] = event.count[participantData.visType] + 1;

              event.count.total = event.count.total + 1;
            })

          //add sequence to each unique event type
          let allEvents = participantData.provenance.map(d => d.event)
          let uniqueEvents = [... new Set(allEvents)];

          uniqueEvents
            .map(e => {
              let event = newEvents.find(ev => ev.name == e);
              event.sequences[participantData.visType].push(allEvents.map(e => {
                let event = newEvents.find(ev => ev.name == e);
                return event.id
              }));
            })
        }

      })


    });

    console.log('newEvents', newEvents)
    setEvents(newEvents);

  }, [selectedTaskIds]);

  let currentTaskData = React.useMemo(() => {
    let internalTaskData = [];

    selectedTaskIds.map(selectedTaskId => {
      allProvenanceData.forEach((participant) => {
        const newObj = Object.assign(
          { id: participant.id },
          participant.data[selectedTaskId]
        );

        if (participant.data[selectedTaskId]) {
          //add type to provenance objects and remove hidden event types;
          newObj.provenance = newObj.provenance
            .map(e => {
              let event = events.find(ev => ev.name == e.event);
              e.type = event.type
              return e;
            })
            .filter(e => {
              let event = events.find(ev => ev.name == e.event);
              return event.visible
            })
          internalTaskData.push(newObj);
        }
      });

    })



    return internalTaskData;
  }, [allProvenanceData, selectedTaskIds, events]);


  //get pattern data from server;
  // console.log(currentTaskData)
  const [isLoading, isError, dataFromServer] = useFetchAPIData(async () => {
    let sequences = {};
    events.map(e => { sequences[e.name] = { sequences: e.sequences } });
    return await performPrefixSpan(sequences);
  }, [events]);
  // console.log("check out the prefix span data", isLoading, isError, dataFromServer);

  useEffect(() => {
    console.log('setting patterns', dataFromServer)
    //convert sequences back to names; 

    if (dataFromServer) {
      Object.keys(dataFromServer).map(event => {
        let eventObj = dataFromServer[event]['results']
        let conditions = Object.keys(eventObj);
        conditions.map(c => {
          eventObj[c] = eventObj[c].map(arr => {
            let [count, seq] = arr;
            seq = seq.map(s => {
              let event = events.find(e => e.id == s);
              return { id: event.name, event: event.name }
            })
            return { count: arr[0], seq }
          })
        })
      })

      setPatterns(dataFromServer)


    }

  }, [dataFromServer])
  // console.log("relative", allProvenanceData);
  return (
    <ProvenanceDataContext.Provider
      value={{
        allProvenanceData,
        currentTaskData,
        taskStructure,
        handleChangeSelectedTaskId,
        selectedTaskIds,
        setTaskSort,
        events,
        patterns,
        hideEvent,
        newEvent,
        renameEvent,
        deleteEvent,
        addRemoveChild
      }}>
      {children}
    </ProvenanceDataContext.Provider>
  );
};

function removeDuplicates(arr) {
  return arr.filter(function (item, pos, arr) {
    // Always keep the 0th element as there is nothing before it
    // Then check if each element is different than the one before it
    return pos === 0 || item !== arr[pos - 1];
  });
}
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
  unrelativeProvenanceData = unrelativeProvenanceData.filter(d => Object.keys(d.data).length > 0);

  //remove elements with no, or messed up provenance (more than one started prov event)
  unrelativeProvenanceData = unrelativeProvenanceData.filter(d => {
    let tasks = Object.keys(d.data).filter(t => t.includes('task'));

    return tasks.reduce((acc, task) => {
      if (!d.data[task].provenance) {
        //participant has no provenance for a certain task. 
        return false
      } else {
        //element has more than on 'startedProvenance' event in the same task. 
        return acc && (d.data[task].provenance.filter(p => p.event == 'startedProvenance').length == 1)
      }
    }, true)
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

  const relativeProvenanceData = _.cloneDeep(unrelativeProvenanceData)

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
        participant.data[taskId].provenance.map(p => p.id = p.event);

      } else {
        delete relativeProvenanceData[index][taskId];
        // console.log("NO DATA", relativeProvenanceData[index], taskId);
      }
    });
  });



  return relativeProvenanceData;
}

// function computeSequences(){

// }

export default ProvenanceDataContext;
