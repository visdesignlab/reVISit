import React from "react";
import { Button } from 'antd';
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import EventLayers from "../components/EventLayers";
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  EllipsisOutlined
} from '@ant-design/icons';


const Overview = ({ location }) => {
  let newData = relativeProvenanceData[0].map((dataArr) => {
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 2; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }

  //iterate through and create list of unique events; 
  let allEvents = [];

  newData.map(d => d.provGraph.nodes.map(n => {
    allEvents.push(n.event)
  }))

  allEvents = [... new Set(allEvents)].map(d => {
    return {
      'title': d,
      'key': d,
      'icon': <EyeTwoTone />,
      children: ['Alex', 'Lane', 'Jeff', 'Noeska'].map(t => {
        return {
          'title': d + '_' + t,
          'key': d + '_' + t,
          'icon': <EyeTwoTone />,
          'children': []
        }
      })
    }
  });

  // {"title": "0-0", "key": "0-0", "children":

  console.log('allEvents', allEvents)
  // return <Button type="primary">This is an Ant Button</Button>;
  return <EventLayers gData={allEvents} />

};

export default Overview;
