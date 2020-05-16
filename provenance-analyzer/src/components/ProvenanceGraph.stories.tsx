import React from "react";
import { storiesOf } from "@storybook/react";
import provData from "../common/data/provenanceMocks.js";
import ProvenanceGraph from "./ProvenanceGraph";
import { start } from "repl";

function trimProvGraph(entireProvGraph){
  let trimedProvGraph = {};
  let startTime, stopTime;
  console.log('jhere!',entireProvGraph);
  trimedProvGraph['nodes'] = entireProvGraph.map(provenanceNode=>{
    let trimmedNode = {};

    trimmedNode.event = provenanceNode.event ? provenanceNode.event : 'Start Task';
    trimmedNode.time = provenanceNode.time;
    if(trimmedNode.event === 'Start Task'){
      startTime = new Date(provenanceNode.time);
    }
    if(trimmedNode.event === 'Finished Task'){
      stopTime = new Date(provenanceNode.time) //provenanceNode.time;
    }
    trimmedNode.target = null; // to display meta info about event target (ie node 'J_heer')
    trimmedNode.trigger = null; // to display meta info about event trigger (ie click, drag, etc)

    return trimmedNode;
  })

  trimedProvGraph['startTime'] = startTime;
  trimedProvGraph['stopTime'] = stopTime;
  trimedProvGraph['correct'] = 1;

  return trimedProvGraph
}

storiesOf("ProvGraphs", module).add("small", () => {
  return (<div>
    <ProvenanceGraph provenanceGraph={trimProvGraph(provData)} />
  <ProvenanceGraph provenanceGraph={trimProvGraph(provData)} />
    </div>)
}
  
);
