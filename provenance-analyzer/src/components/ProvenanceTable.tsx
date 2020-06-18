import React, { forwardRef } from "react";
import MaterialTable, {
  MTableToolbar,
  MTableAction,
  MTableActions,
} from "material-table";
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
import Label from "@material-ui/icons/Label";
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
  const [rerender, setRerender] = React.useState(false);
  const [min, max] = d3.extent(
    provenanceData,
    (datum) => datum.provGraph.totalTime
  );

  const xScale = d3.scaleLinear().domain([0, max]).range([0, width]);

  function renderProvenanceNodes(data) {
    console.log("render provenance nodes called");
    return (
      <ProvenanceIsolatedNodes
        nodes={data.provGraph.nodes}></ProvenanceIsolatedNodes>
    );
  }
  function renderProvenanceTime(data) {
    console.log("render provenance time called");
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
  const [timeColumn] = React.useState({
    title: "Time To Complete",
    field: "provGraph",
    width: 250,
    cellStyle: {
      maxWidth: 250,
    },
    customSort: (a, b) => a.provGraph.totalTime - b.provGraph.totalTime,
    render: renderProvenanceTime,
    customFilterAndSearch: (filterResults, datum) => {
      // https://github.com/mbrn/material-table/pull/1351
      if (
        datum.provGraph.totalTime >= filterResults[0] &&
        datum.provGraph.totalTime <= filterResults[1]
      ) {
        return true;
      }
      delete datum.tableData.checked;

      return false;
    },

    filterComponent: (props) => (
      <TimeFilterObj
        {...props}
        xScale={xScale}
        data={provenanceData.map(
          (graph) => graph.provGraph.totalTime
        )}></TimeFilterObj>
    ),
  });

  /*const [correct] = React.useState({
    title: "Accuracy",
    field: "provGraph",
    width: 250,
    cellStyle: {
      maxWidth: 250,
    },
    customSort: (a, b) => a.provGraph.correct - b.provGraph.correct,
    render: renderProvenanceTime,
    customFilterAndSearch: (filterResults, datum) => {
      // https://github.com/mbrn/material-table/pull/1351
      if (
        datum.provGraph.totalTime >= filterResults[0] &&
        datum.provGraph.totalTime <= filterResults[1]
      ) {
        return true;
      }
      delete datum.tableData.checked;

      return false;
    },

    filterComponent: (props) => (
      <TimeFilterObj
        {...props}
        xScale={xScale}
        data={provenanceData.map(
          (graph) => graph.provGraph.totalTime
        )}></TimeFilterObj>
    ),
  });*/
  const [eventsCol] = React.useState({
    title: "Events Used",
    field: "provGraph",
    width: 500,
    cellStyle: {
      maxWidth: 500,
    },
    customSort: (a, b) => a.provGraph.nodes.length - b.provGraph.nodes.length,
    render: renderProvenanceNodes,
    filterComponent: () => <div></div>,
  });
  const TimeFilterObj = TimeFilter;
  return (
    <MaterialTable
      title={"Provenance Table"}
      components={{
        Actions: (props) => {
          return (
            <div
              style={{
                display: "flex",
                float: "left",
                backgroundColor: "#ffe2ec",
              }}>
              <MTableActions {...props}></MTableActions>
            </div>
          );
        },
        Action: (props) => {
          console.log("dywootto", props);
          if (props.action.myComponent) {
            let ActionComponent = props.action.myComponent;
            return <ActionComponent {...props}></ActionComponent>;
          }
          return <MTableAction {...props}></MTableAction>;
        },
      }}
      columns={[
        timeColumn,
        eventsCol,
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
                      (iterTag) => {
                        return iterTag.name === tag[0]?.name;
                      }
                    );
                    if (index > -1) {
                      rowData.tableData.tags.splice(index, 1);
                    }
                  }
                }}></TagWrapper>
            );
          },
        },
      ]}
      onSelectionChange={(selections) => {
        if (selections.length === 0) {
          setCheckedTags([]);
        }
      }}
      actions={[
        {
          myComponent: (props) => {
            return (
              <TagWrapper
                tags={checkedTags.filter((tag) => !tag.removed)}
                onTagChange={(action, tag) => {
                  // check if rowData is selected;
                  if (action === "Add") {
                    let temp = Object.assign([], checkedTags);
                    let existing = temp.find(
                      (checkedTags) => checkedTags.name === tag.name
                    );
                    if (existing) {
                      existing.removed = false;
                    } else {
                      temp.push(tag);
                    }

                    setCheckedTags(temp);
                  } else {
                    let index = checkedTags.findIndex(
                      (item) => item.name === tag?.[0].name
                    );
                    let temp = Object.assign([], checkedTags);

                    if (index > -1) {
                      temp[index].removed = true;
                    }
                    setCheckedTags(temp);
                  }
                }}></TagWrapper>
            );
          },
        },
        {
          tooltip: "Update tags of selected rows (appends ontop).",
          icon: (props, ref) => <Label {...props} ref={ref} />,
          onClick: (evt, data) => {
            data.forEach((datum) => {
              if (datum.tableData.checked) {
                checkedTags.forEach((tag) => {
                  const datumTagIndex = datum.tableData.tags.findIndex(
                    (currentTag) => currentTag.name === tag.name
                  );
                  if (datumTagIndex === -1) {
                    if (!tag.removed) {
                      datum.tableData.tags.push(tag);
                    }
                  } else {
                    if (tag.removed) {
                      datum.tableData.tags.splice(datumTagIndex, 1);
                    }
                  }
                });
              }
            });
            setRerender(!rerender);
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
