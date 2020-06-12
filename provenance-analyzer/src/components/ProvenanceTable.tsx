import React, { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import ProvenanceGraph from "./ProvenanceGraph";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
// typings are here:
import { Icons } from "material-table";
import * as d3 from "d3";

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// import data
const xScale = d3.scaleLinear().domain([0, 1]).range([0, 200]);

const MaterialTableWrapper = ({ provenanceData }) => {
  function renderProvenanceNodes(data) {
    console.log(data);
    return (
      <ProvenanceIsolatedNodes
        nodes={data.provGraph.nodes}></ProvenanceIsolatedNodes>
    );
  }
  function renderProvenanceTime(data) {
    console.log(data);
    return (
      <svg width={250} height={20}>
        <ProvenanceGraph
          provenanceGraph={data.provGraph}
          xScale={xScale}
          renderIcons={false}
          collapseEvents={true}
        />
      </svg>
    );
  }
  console.log("dywootto provenance", provenanceData);
  return (
    <MaterialTable
      title="Render Image Preview"
      columns={[
        {
          title: "Time To Complete",
          field: "provGraph",
          width: 250,
          customSort: (a, b) => a.provGraph.stopTime - b.provGraph.stopTime,
          render: renderProvenanceTime,
        },
        {
          title: "Events Used",
          field: "provGraph",
          width: 500,
          cellStyle: {
            maxWidth: 500,
          },
          customSort: (a, b) =>
            a.provGraph.nodes.length - b.provGraph.nodes.length,
          render: renderProvenanceNodes,
        },
      ]}
      data={provenanceData}
      icons={tableIcons}
      options={{ selection: true, search: false, paging: false }}
    />
  );
};

export default MaterialTableWrapper;

/*[
        {
          name: "Mehmet",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 63,
          imageUrl:
            "https://avatars0.githubusercontent.com/u/7895451?s=460&v=4",
        },
        {
          name: "Zerya Betül",
          surname: "Baran",
          birthYear: 2017,
          birthCity: 34,
          imageUrl:
            "https://avatars0.githubusercontent.com/u/7895451?s=460&v=4",
        },
      ]*/
