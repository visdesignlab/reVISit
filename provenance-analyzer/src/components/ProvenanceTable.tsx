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
import TagsInput from "react-tagsinput";
import TagStyles from "./tagstyles.module.css";
import TagWrapper from "./reactTagWrapper";
import TimeFilter from "./TableFilters";

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
const width = 200;
const MaterialTableWrapper = ({ provenanceData }) => {
  const [checkedTags, setCheckedTags] = React.useState([]);
  const [min, max] = d3.extent(
    provenanceData,
    (datum) => datum.provGraph.totalTime
  );

  const xScale = d3.scaleLinear().domain([0, max]).range([0, width]);

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

  const TimeFilterObj = TimeFilter;
  console.log("dywootto provenance", provenanceData);
  return (
    <MaterialTable
      title={"Provenance Table"}
      components={{
        Toolbar: (props) => {
          console.log("title values", props);
          return (
            <div>
              <MTableToolbar {...props} />
              {props.selectedRows.length !== 0 ? (
                <div
                  style={{ direction: "rtl" }}
                  classname={`MuiToolbar-root MuiToolbar-regular MTableToolbar-root-192 MTableToolbar-highlight-193 MuiToolbar-gutters`}>
                  <TagWrapper
                    tags={checkedTags}
                    onTagChange={(action, tag) => {
                      // check if rowData is selected;
                      if (action === "Add") {
                        let temp = Object.assign([], checkedTags);

                        temp.push(tag);
                        setCheckedTags(temp);
                      } else {
                        let index = checkedTags.findIndex(
                          (item) => item.name === tag.name
                        );
                        console.log(index, tag);
                        let temp = Object.assign([], checkedTags);

                        if (index > -1) {
                          temp.splice(index, 1);
                        }
                        setCheckedTags(temp);
                      }
                      console.log("here in tag change", action, tag);
                    }}></TagWrapper>
                </div>
              ) : (
                <div style={{ height: "20px" }}></div>
              )}
            </div>
          );
        },
      }}
      columns={[
        {
          title: "Time To Complete",
          field: "provGraph",
          width: 250,
          cellStyle: {
            maxWidth: 250,
          },
          customSort: (a, b) => a.provGraph.totalTime - b.provGraph.totalTime,
          render: renderProvenanceTime,
          customFilterAndSearch: (filterResults, datum) => {
            console.log("custom filter", filterResults, datum); // https://github.com/mbrn/material-table/pull/1351
            return (
              datum.provGraph.totalTime >= filterResults[0] &&
              datum.provGraph.totalTime <= filterResults[1]
            );
          },

          filterComponent: (props) => (
            <TimeFilterObj
              {...props}
              xScale={xScale}
              data={provenanceData.map(
                (graph) => graph.provGraph.totalTime
              )}></TimeFilterObj>
          ),
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
          filterComponent: () => <div></div>,
        },
        {
          title: "Notes",
          field: "None",
          width: 500,
          filterComponent: () => <div></div>,
          render: (rowData) => {
            if (!Array.isArray(rowData.tableData?.tags)) {
              rowData.tableData.tags = [];
            }
            return (
              <TagWrapper
                tags={rowData.tableData.tags}
                onTagChange={(action, tag) => {
                  // check if rowData is selected;
                  if (action === "Add") {
                    rowData.tableData.tags.push(tag);
                  } else {
                    const index = rowData.tableData.tags.findIndex(
                      (iterTag) => iterTag.name === tag.name
                    );
                    if (index > -1) {
                      rowData.tableData.tags.splice(index, 1);
                    }
                  }
                  console.log("here in tag change", action, tag);
                }}></TagWrapper>
            );
          },
        },
      ]}
      onSelectionChange={(sels) => console.log(sels)}
      actions={[
        {
          tooltip: "Add most recent tag to all.",
          icon: "add",
          onClick: (evt, data) => {
            data.forEach((datum) => {
              if (datum.tableData.checked) {
                console.log("datum before", datum, checkedTags);
                datum.tableData.tags = datum.tableData.tags.concat(checkedTags);
                console.log("datum after", datum);
              }
            });
            setCheckedTags([]);
            console.log("after data set", evt, data, checkedTags);
          },
        },
      ]}
      data={provenanceData}
      icons={tableIcons}
      options={{
        selection: true,
        search: false,
        paging: false,
        filtering: true,
      }}
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
