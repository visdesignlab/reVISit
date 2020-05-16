//import allProvenanceData from "./allProvenanceMocks.js";
//import task1Data from './task1ProvData.js'l
import * as d3 from "d3";

let taskIds = ["S-task01", "S-task02", "S-task03", "S-task04", "S-task05", "S-task06", "S-task07", "S-task08", "S-task09", "S-task010", "S-task011", "S-task012"]

let allTaskData = [];
for (let i = 0; i < taskIds.length; i++) {
  allTaskData.push(require(`./taskPartitioned/${taskIds[i]}.json`));
}

let allProvData = [];
const allData = {
  id: "58c84d506d1c600001a09319_S-task01",
  data: {
    id: "58c84d506d1c600001a09319",
    initialSetup: "Mon Aug 26 2019 21:27:06 GMT-0700 (Pacific Daylight Time)",
    mode: "study",
    provGraphs: [{
        clicked: [],
        count: 0,
        endTime: "",
        nodes: "",
        search: "",
        selections: {
          answerBox: {},
          attrRow: {},
          cellcol: {},
          cellrow: {},
          colLabel: {},
          neighborSelect: {},
          previousMouseovers: [],
          rowLabel: {},
          search: {},
        },
        sortKey: "statuses_count",
        startTime: 1566880025209,
        taskID: {
          answer: {
            nodes: [],
            value: "",
          },
          answerKey: {
            id: ["18704160"],
            nodes: ["T.J"],
          },
          config: {
            adjMatrix: {
              edgeBars: true,
              neighborHighlightColor: "",
              neighborSelect: true,
              sortKey: "statuses_count",
              toggle: false,
            },
            adjMatrixValues: {},
            attributeScales: {
              edge: {
                count: {
                  domain: [1, 5],
                  label: "# Interactions",
                },
                type: {
                  domain: ["mentions", "retweet", "interacted"],
                  label: "Edge Type",
                  range: ["#ff2700", "#008fd5", "rgb(91, 91, 91)"],
                },
              },
              node: {
                continent: {
                  domain: ["North America", "South America", "Europe", "Asia"],
                  glyph: "square",
                  label: "Continent",
                  legendLabels: ["NA", "SA", "EU", "AS"],
                  range: ["#5ba3d0", "#7d6dcb", "#ce9333", "#6aa858"],
                },
                count_followers_in_query: {
                  domain: [0, 35],
                  label: "In-Network followers",
                },
                favourites_count: {
                  domain: [0, 8000],
                  label: "Likes",
                },
                followers_count: {
                  domain: [0, 1200],
                  label: "Followers",
                },
                friends_count: {
                  domain: [0, 1200],
                  label: "Friends",
                },
                listed_count: {
                  domain: [0, 120],
                  label: "In Lists",
                },
                memberFor_days: {
                  domain: [175, 4498],
                  label: "Acct. Age",
                },
                query_tweet_count: {
                  domain: [0, 10],
                  label: "On-topic Tweets",
                },
                selected: {
                  domain: [true, false],
                  glyph: "rect",
                  label: "selected",
                  labels: ["answer", "not answer"],
                  range: ["#e86b45", "#fff"],
                },
                statuses_count: {
                  domain: [0, 5500],
                  label: "Tweets",
                },
                type: {
                  domain: ["person", "institution"],
                  glyph: "circle",
                  label: "Type",
                  legendLabels: ["Person", "Inst."],
                  range: ["#e86b45", "#514ed9"],
                },
              },
            },
            edgeAttributes: ["type"],
            graphFiles: {
              cluster: "data/network_large_undirected_singleEdge_cytoscape.json",
              large_directed_multiEdge: "data/network_large_directed_multiEdge.json",
              large_undirected_multiEdge: "data/network_large_undirected_multiEdge.json",
              large_undirected_singleEdge: "data/network_large_undirected_singleEdge.json",
              sample: "data/s_network_small_undirected_singleEdge.json",
              small_directed_multiEdge: "data/network_small_directed_multiEdge.json",
              small_undirected_multiEdge: "data/network_small_undirected_multiEdge.json",
              small_undirected_singleEdge: "data/network_small_undirected_singleEdge.json",
            },
            graphSize: "large",
            isDirected: false,
            isMultiEdge: false,
            loadedGraph: "large_undirected_singleEdge",
            nodeAttributes: ["selected", "continent", "statuses_count"],
            nodeIsRect: true,
            nodeLink: {
              drawBars: false,
              edgeStrokeAttr: "type",
              edgeWidthAttr: null,
              labelAttr: "shortName",
              labelSize: 12,
              noEdgeColor: "rgb(91, 91, 91)",
              noNodeFill: "rgb(153, 191, 195)",
              noNodeStroke: "#c8c8c8",
              nodeFillAttr: "continent",
              nodeHeight: 40,
              nodeSizeAttr: "statuses_count",
              nodeWidth: 40,
              quantColors: [
                "#7b7cb1",
                "#01a068",
                "#bf8531",
                "#5472cf",
                "#4d8615",
                "#d63d61",
                "#ae76ed",
                "#f26336",
              ],
              selectNeighbors: true,
            },
            state: {
              adjMatrix: {},
            },
            style: {
              hoveredNodeColor: "#fde8ca",
              selectedEdgeColor: "#e86b45",
              selectedNodeColor: "#e86b45",
            },
          },
          hypothesis: "Distractor Effect Hypothesis, Attribute Sorting Hypothesis",
          order: 4,
          prompt: "Find the <span class='attribute'>North American</span> with the <span class='attribute'>most Tweets</span>",
          replyCount: 1,
          replyType: ["singleNodeSelection"],
          startTime: "Mon Aug 26 2019 21:27:04 GMT-0700 (Pacific Daylight Time)",
          taskID: "S-task01",
          taxonomy: {
            target: "single node",
            type: "TGA",
          },
          workerID: "58c84d506d1c600001a09319",
        },
        time: 1566880025209,
        workerID: "58c84d506d1c600001a09319",
      },
      {
        clicked: [],
        count: 0,
        endTime: "",
        event: "answerBox",
        nodes: "",
        search: "",
        selections: {
          answerBox: {
            "18704160": ["answerBox"],
          },
          attrRow: {},
          cellcol: {},
          cellrow: {},
          colLabel: {},
          neighborSelect: {},
          previousMouseovers: [],
          rowLabel: {},
          search: {},
        },
        sortKey: "statuses_count",
        startTime: 1566880025209,
        taskID: {
          answer: {
            nodes: [],
            value: "",
          },
          answerKey: {
            id: ["18704160"],
            nodes: ["T.J"],
          },
          config: {
            adjMatrix: {
              edgeBars: true,
              neighborHighlightColor: "",
              neighborSelect: true,
              sortKey: "statuses_count",
              toggle: false,
            },
            adjMatrixValues: {},
            attributeScales: {
              edge: {
                count: {
                  domain: [1, 5],
                  label: "# Interactions",
                },
                type: {
                  domain: ["mentions", "retweet", "interacted"],
                  label: "Edge Type",
                  range: ["#ff2700", "#008fd5", "rgb(91, 91, 91)"],
                },
              },
              node: {
                continent: {
                  domain: ["North America", "South America", "Europe", "Asia"],
                  glyph: "square",
                  label: "Continent",
                  legendLabels: ["NA", "SA", "EU", "AS"],
                  range: ["#5ba3d0", "#7d6dcb", "#ce9333", "#6aa858"],
                },
                count_followers_in_query: {
                  domain: [0, 35],
                  label: "In-Network followers",
                },
                favourites_count: {
                  domain: [0, 8000],
                  label: "Likes",
                },
                followers_count: {
                  domain: [0, 1200],
                  label: "Followers",
                },
                friends_count: {
                  domain: [0, 1200],
                  label: "Friends",
                },
                listed_count: {
                  domain: [0, 120],
                  label: "In Lists",
                },
                memberFor_days: {
                  domain: [175, 4498],
                  label: "Acct. Age",
                },
                query_tweet_count: {
                  domain: [0, 10],
                  label: "On-topic Tweets",
                },
                selected: {
                  domain: [true, false],
                  glyph: "rect",
                  label: "selected",
                  labels: ["answer", "not answer"],
                  range: ["#e86b45", "#fff"],
                },
                statuses_count: {
                  domain: [0, 5500],
                  label: "Tweets",
                },
                type: {
                  domain: ["person", "institution"],
                  glyph: "circle",
                  label: "Type",
                  legendLabels: ["Person", "Inst."],
                  range: ["#e86b45", "#514ed9"],
                },
              },
            },
            edgeAttributes: ["type"],
            graphFiles: {
              cluster: "data/network_large_undirected_singleEdge_cytoscape.json",
              large_directed_multiEdge: "data/network_large_directed_multiEdge.json",
              large_undirected_multiEdge: "data/network_large_undirected_multiEdge.json",
              large_undirected_singleEdge: "data/network_large_undirected_singleEdge.json",
              sample: "data/s_network_small_undirected_singleEdge.json",
              small_directed_multiEdge: "data/network_small_directed_multiEdge.json",
              small_undirected_multiEdge: "data/network_small_undirected_multiEdge.json",
              small_undirected_singleEdge: "data/network_small_undirected_singleEdge.json",
            },
            graphSize: "large",
            isDirected: false,
            isMultiEdge: false,
            loadedGraph: "large_undirected_singleEdge",
            nodeAttributes: ["selected", "continent", "statuses_count"],
            nodeIsRect: true,
            nodeLink: {
              drawBars: false,
              edgeStrokeAttr: "type",
              edgeWidthAttr: null,
              labelAttr: "shortName",
              labelSize: 12,
              noEdgeColor: "rgb(91, 91, 91)",
              noNodeFill: "rgb(153, 191, 195)",
              noNodeStroke: "#c8c8c8",
              nodeFillAttr: "continent",
              nodeHeight: 40,
              nodeSizeAttr: "statuses_count",
              nodeWidth: 40,
              quantColors: [
                "#7b7cb1",
                "#01a068",
                "#bf8531",
                "#5472cf",
                "#4d8615",
                "#d63d61",
                "#ae76ed",
                "#f26336",
              ],
              selectNeighbors: true,
            },
            state: {
              adjMatrix: {},
            },
            style: {
              hoveredNodeColor: "#fde8ca",
              selectedEdgeColor: "#e86b45",
              selectedNodeColor: "#e86b45",
            },
          },
          hypothesis: "Distractor Effect Hypothesis, Attribute Sorting Hypothesis",
          order: 4,
          prompt: "Find the <span class='attribute'>North American</span> with the <span class='attribute'>most Tweets</span>",
          replyCount: 1,
          replyType: ["singleNodeSelection"],
          startTime: "Mon Aug 26 2019 21:27:04 GMT-0700 (Pacific Daylight Time)",
          taskID: "S-task01",
          taxonomy: {
            target: "single node",
            type: "TGA",
          },
          workerID: "58c84d506d1c600001a09319",
        },
        time: 1566880110088,
        workerID: "58c84d506d1c600001a09319",
      },
      {
        clicked: [],
        count: 0,
        endTime: "",
        event: "Finished Task",
        nodes: "",
        search: "",
        selections: {
          answerBox: {
            "18704160": ["answerBox"],
          },
          attrRow: {},
          cellcol: {},
          cellrow: {},
          colLabel: {},
          neighborSelect: {},
          previousMouseovers: [{
              event: "attrRow18704160",
              time: 1566880110855,
            },
            {
              event: "cell190726679_1068137549355515900",
              time: 1566880111007,
            },
            {
              event: "cell190726679_270431596",
              time: 1566880111044,
            },
            {
              event: "cell9527212_79908341",
              time: 1566880111091,
            },
            {
              event: "cell91169926_1055379531731796000",
              time: 1566880111140,
            },
            {
              event: "cell15208867_4058687172",
              time: 1566880111167,
            },
            {
              event: "cell14905766_743468486756868100",
              time: 1566880111191,
            },
            {
              event: "cell3230388598_711885257549680600",
              time: 1566880111216,
            },
            {
              event: "cell18406335_711885257549680600",
              time: 1566880111241,
            },
            {
              event: "cell10414152_711885257549680600",
              time: 1566880111723,
            },
            {
              event: "cell10414152_158685605",
              time: 1566880113574,
            },
            {
              event: "cell18406335_1667081238",
              time: 1566880113601,
            },
            {
              event: "cell11493602_4893004803",
              time: 1566880113625,
            },
            {
              event: "cell22766040_1658560038",
              time: 1566880113650,
            },
            {
              event: "cell22766040_1873322353",
              time: 1566880113675,
            },
            {
              event: "cell22766040_30009655",
              time: 1566880113990,
            },
            {
              event: "cell84043985_2596138699",
              time: 1566880114013,
            },
            {
              event: "cell84043985_241173920",
              time: 1566880114037,
            },
            {
              event: "cell84043985_49457800",
              time: 1566880114064,
            },
            {
              event: "cell84043985_208312922",
              time: 1566880114089,
            },
            {
              event: "cell84043985_18325271",
              time: 1566880114114,
            },
            {
              event: "cell84043985_16557883",
              time: 1566880114139,
            },
            {
              event: "cell84043985_11493602",
              time: 1566880114162,
            },
            {
              event: "cell84043985_15208867",
              time: 1566880114186,
            },
            {
              event: "cell21084111_9527212",
              time: 1566880114211,
            },
            {
              event: "cell6146692_318046158",
              time: 1566880114236,
            },
            {
              event: "rowLabel6146692",
              time: 1566880114260,
            },
          ],
          rowLabel: {},
          search: {},
        },
        sortKey: "statuses_count",
        startTime: 1566880025209,
        taskID: {
          answer: {
            nodes: [],
            value: "",
          },
          answerKey: {
            id: ["18704160"],
            nodes: ["T.J"],
          },
          config: {
            adjMatrix: {
              edgeBars: true,
              neighborHighlightColor: "",
              neighborSelect: true,
              sortKey: "statuses_count",
              toggle: false,
            },
            adjMatrixValues: {},
            attributeScales: {
              edge: {
                count: {
                  domain: [1, 5],
                  label: "# Interactions",
                },
                type: {
                  domain: ["mentions", "retweet", "interacted"],
                  label: "Edge Type",
                  range: ["#ff2700", "#008fd5", "rgb(91, 91, 91)"],
                },
              },
              node: {
                continent: {
                  domain: ["North America", "South America", "Europe", "Asia"],
                  glyph: "square",
                  label: "Continent",
                  legendLabels: ["NA", "SA", "EU", "AS"],
                  range: ["#5ba3d0", "#7d6dcb", "#ce9333", "#6aa858"],
                },
                count_followers_in_query: {
                  domain: [0, 35],
                  label: "In-Network followers",
                },
                favourites_count: {
                  domain: [0, 8000],
                  label: "Likes",
                },
                followers_count: {
                  domain: [0, 1200],
                  label: "Followers",
                },
                friends_count: {
                  domain: [0, 1200],
                  label: "Friends",
                },
                listed_count: {
                  domain: [0, 120],
                  label: "In Lists",
                },
                memberFor_days: {
                  domain: [175, 4498],
                  label: "Acct. Age",
                },
                query_tweet_count: {
                  domain: [0, 10],
                  label: "On-topic Tweets",
                },
                selected: {
                  domain: [true, false],
                  glyph: "rect",
                  label: "selected",
                  labels: ["answer", "not answer"],
                  range: ["#e86b45", "#fff"],
                },
                statuses_count: {
                  domain: [0, 5500],
                  label: "Tweets",
                },
                type: {
                  domain: ["person", "institution"],
                  glyph: "circle",
                  label: "Type",
                  legendLabels: ["Person", "Inst."],
                  range: ["#e86b45", "#514ed9"],
                },
              },
            },
            edgeAttributes: ["type"],
            graphFiles: {
              cluster: "data/network_large_undirected_singleEdge_cytoscape.json",
              large_directed_multiEdge: "data/network_large_directed_multiEdge.json",
              large_undirected_multiEdge: "data/network_large_undirected_multiEdge.json",
              large_undirected_singleEdge: "data/network_large_undirected_singleEdge.json",
              sample: "data/s_network_small_undirected_singleEdge.json",
              small_directed_multiEdge: "data/network_small_directed_multiEdge.json",
              small_undirected_multiEdge: "data/network_small_undirected_multiEdge.json",
              small_undirected_singleEdge: "data/network_small_undirected_singleEdge.json",
            },
            graphSize: "large",
            isDirected: false,
            isMultiEdge: false,
            loadedGraph: "large_undirected_singleEdge",
            nodeAttributes: ["selected", "continent", "statuses_count"],
            nodeIsRect: true,
            nodeLink: {
              drawBars: false,
              edgeStrokeAttr: "type",
              edgeWidthAttr: null,
              labelAttr: "shortName",
              labelSize: 12,
              noEdgeColor: "rgb(91, 91, 91)",
              noNodeFill: "rgb(153, 191, 195)",
              noNodeStroke: "#c8c8c8",
              nodeFillAttr: "continent",
              nodeHeight: 40,
              nodeSizeAttr: "statuses_count",
              nodeWidth: 40,
              quantColors: [
                "#7b7cb1",
                "#01a068",
                "#bf8531",
                "#5472cf",
                "#4d8615",
                "#d63d61",
                "#ae76ed",
                "#f26336",
              ],
              selectNeighbors: true,
            },
            state: {
              adjMatrix: {},
            },
            style: {
              hoveredNodeColor: "#fde8ca",
              selectedEdgeColor: "#e86b45",
              selectedNodeColor: "#e86b45",
            },
          },
          hypothesis: "Distractor Effect Hypothesis, Attribute Sorting Hypothesis",
          order: 4,
          prompt: "Find the <span class='attribute'>North American</span> with the <span class='attribute'>most Tweets</span>",
          replyCount: 1,
          replyType: ["singleNodeSelection"],
          startTime: "Mon Aug 26 2019 21:27:04 GMT-0700 (Pacific Daylight Time)",
          taskID: "S-task01",
          taxonomy: {
            target: "single node",
            type: "TGA",
          },
          workerID: "58c84d506d1c600001a09319",
        },
        time: "Mon Aug 26 2019 21:28:37 GMT-0700 (Pacific Daylight Time)",
        workerID: "58c84d506d1c600001a09319",
      },
    ],
    update: "Mon Aug 26 2019 21:28:37 GMT-0700 (Pacific Daylight Time)",
  },
};
//S - task01;
//const allProvenanceData = [allData];
let provDataForTask = [];
let provset = new Set()

allTaskData.forEach(taskData => {
  let forTaskFilter = taskData.filter(value => value.data.provGraphs);
  /*allProvenanceData.filter((run) =>
    run.id.includes("S-task01")
  );*/

  function trimProvGraph(entireProvGraph) {
    if (!entireProvGraph || !Array.isArray(entireProvGraph)) {
      return;
    }
    let trimmedProvGraph = {};
    let startTime, stopTime;
    trimmedProvGraph["nodes"] = entireProvGraph.map((provenanceNode) => {
      let trimmedNode = {};

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
      trimmedNode.target = null; // to display meta info about event target (ie node 'J_heer')
      trimmedNode.trigger = null; // to display meta info about event trigger (ie click, drag, etc)
      provset.add(trimmedNode.event);
      return trimmedNode;
    });
    const totalTime = stopTime - startTime;
    trimmedProvGraph["nodes"].forEach(node => {

      node.time = (node.time - startTime) / (totalTime); // relative time

    })


    trimmedProvGraph["startTime"] = (startTime - startTime) / (totalTime); // 0
    trimmedProvGraph["stopTime"] = (stopTime - startTime) / (totalTime); // 1
    trimmedProvGraph["totalTime"] = totalTime;
    trimmedProvGraph["correct"] = 1;

    return trimmedProvGraph;
  }

  // find the person with longest time, 
  let unrelativeProvData = forTaskFilter.map((value) => {
    return trimProvGraph(value.data.provGraphs);
  });

  let longestTime = d3.max(unrelativeProvData, d => {
    if (d) {
      return d.totalTime;
    }
    return 0;

  });
  let provData;
  if (false) {
    provData = provData = unrelativeProvData.map(provGraph => {
      let scale = longestTime / provGraph.totalTime;
      provGraph["startTime"] = provGraph["startTime"] / (scale);
      provGraph["stopTime"] = provGraph["stopTime"] / (scale);
      provGraph["nodes"] = provGraph["nodes"].map(node => {
        node['time'] = node["time"] / scale;

        return node;
      })
      return provGraph;
    })
  } else {
    provData = unrelativeProvData;
  }
  allProvData.push(provData);
  //const provData = allData.data.provGraphs;
})

console.log('provSet', provset)

export default allProvData;