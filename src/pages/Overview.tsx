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

  const { newEvent } = useContext(ProvenanceDataContext);

  const [search, setSearch] = React.useState("");

  function createEvent(value) {
    {
      setSearch("");
      console.log("new Event is", value);
      newEvent(value);
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
      {/* {patternComponent} */}
      <EventAccordion />
      {/* <CollapsibleTable data={data} onChange={setData} /> */}
      {/* <EventAccordion data={data} onChange={setData} /> */}
    </div>
  </div>)
};

export default Overview;
