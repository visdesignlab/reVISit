//@ts-nocheck

import React, { useState, useEffect, forwardRef, useMemo } from "react";
import MaterialTable, {
  MTableGroupRow,
  MTableBodyRow,
  MTableAction,
  MTableActions,
  MTableFilterRow,
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
import eventMapping from "./eventMapping";
import TagStyles from "./tagstyles.module.css";
import TagWrapper from "./reactTagWrapper";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";

import tableStyles from "./ProvenanceTable.module.css";
//const trimmedPromise = fireFetch("provenance");
/*trimmedPromise.then((promise) => {
  console.log(promise);
});
*/
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

const RowRenderWrapper = (props) => {
  useEffect(() => {
    console.log("Loaded!@");
    props.setIsLoading(false);
  });

  return <MTableBodyRow {...props} />;
};
const GroupRowWrapper = (props) => {
  let newerProps = Object.assign({}, props);
  const handleRowExpansion = (_props) => {
    console.log("clicked group roew!", _props, "new", _props.setIsLoading);
    //props.setIsLoading(true);
    props.onGroupExpandChanged(_props);
    // expand group row
  };
  newerProps.onGroupExpandChanged = (tempProps) => {
    handleRowExpansion(tempProps); //handleRowExpansion;
  };
  return <MTableGroupRow {...newerProps}></MTableGroupRow>;
};

// import data
const width = 200;
const MaterialTableWrapper = ({ provenanceData }) => {
  const handleColumnDrag = (index, dest) => {
    console.log("column drag", index, dest);
  };
  const handleOrderChange = (columnId, colDirection) => {
    console.log("order changed", columnId, colDirection);
  };
  console.log("in Table", provenanceData);
  const [checkedTags, setCheckedTags] = React.useState([]);
  const [rerender, setRerender] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userIdColumnDefinition, setUserIdColumnDefinition] = useState(
    renderUserIdColumn(provenanceData, 100)
  );

  const [stimulusColumnDefinition, setStimulusColumnDefinition] = useState(
    renderStimulusDefinition(provenanceData, 100)
  );

  const [timeColumnDefinition, setTimeColumnDefinition] = useState(
    renderTimeColumn(provenanceData, 250)
  );

  const [accuracyColumnDefinition, setAccuracyColumnDefinition] = useState(
    renderAccuracyColumn(provenanceData, 50)
  );

  const [eventsColumnDefinition, setEventsColumnDefinition] = useState(
    renderProvenanceNodeColumn(provenanceData, 500)
  );

  const [notesColumnDefinition, setNotesColumnDefinition] = useState(
    renderNotesColumn(200)
  );

  React.useEffect(() => {
    setTimeColumnDefinition(renderTimeColumn(provenanceData, 250));
    setAccuracyColumnDefinition(renderAccuracyColumn(provenanceData, 50));
    setEventsColumnDefinition(renderProvenanceNodeColumn(provenanceData, 500));
    setNotesColumnDefinition(renderNotesColumn(200));
  }, [provenanceData]);

  console.log("about to render table", provenanceData);
  return (
    <MaterialTable
      title={"Provenance Table"}
      isLoading={isLoading}
      onColumnDragged={handleColumnDrag}
      onOrderChange={(val1, val2) => handleOrderChange(val1, val2)}
      components={{
        OverlayLoading: (propss) => {
          return (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                zIndex: 11,
              }}>
              <div className={tableStyles["spin"]}></div>
            </div>
          );
        },
        GroupRow: (props) => {
          return (
            <GroupRowWrapper
              setIsLoading={setIsLoading}
              {...props}></GroupRowWrapper>
          );
        },
        Row: (props) => {
          return (
            <RowRenderWrapper
              setIsLoading={setIsLoading}
              {...props}></RowRenderWrapper>
          );
        },
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
          if (props.action.myComponent) {
            let ActionComponent = props.action.myComponent;
            //@ts-ignore
            return <ActionComponent {...props}></ActionComponent>;
          }
          return <MTableAction {...props}></MTableAction>;
        },
        FilterRow: (props) => {
          let styles = {
            "&:nth-child(2)": {
              position: "sticky",
              top: "64px",
              background: "white",
            },
          };
          return <MTableFilterRow styles={styles} {...props}></MTableFilterRow>;
        },
      }}
      columns={[
        userIdColumnDefinition,
        stimulusColumnDefinition,
        timeColumnDefinition,
        accuracyColumnDefinition,
        eventsColumnDefinition,
        notesColumnDefinition,
      ]}
      onSelectionChange={(selections) => {
        if (selections.length === 0) {
          setCheckedTags([]);
        }
      }}
      actions={[
        {
          myComponent: () => {
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
                // if row has not been rendered yet, add tags array
                if (!Array.isArray(datum.tableData?.tags)) {
                  datum.tableData.tags = [];
                }
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
        paging: true,
        pageSize: 15,
        filtering: true,
        maxBodyHeight: "93vh",
        grouping: true,
      }}
    />
  );
};

function generateCategoricalScale(data, width) {
  const uniqueValues = Array.from(new Set(data));
  return d3.scaleBand().rangeRound([0, width]).padding(0).domain(uniqueValues);
}

function renderStimulusDefinition(provenanceData, stimulusColumnWidth) {
  // TODO: Refactor to generalized
  return {
    title: "Stimulus",
    field: "visType",
    width: stimulusColumnWidth,
  };
}

function renderUserIdColumn(provenanceData, userIdColumnWidth) {
  console.log(provenanceData);
  return {
    title: "User Id",
    field: "workerID",
    width: userIdColumnWidth,
  };
}

function renderNotesCell(rowData) {
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
          const index = rowData.tableData.tags.findIndex((iterTag) => {
            return iterTag.name === tag[0]?.name;
          });
          if (index > -1) {
            rowData.tableData.tags.splice(index, 1);
          }
        }
      }}></TagWrapper>
  );
}

function renderNotesColumn(notesColumnWidth) {
  return {
    title: "Notes",
    field: "None",
    cellStyle: {
      padding: "4px 16px",
    },
    width: notesColumnWidth,
    customSort: (a, b) => b.tableData.tags.length - a.tableData.tags.length,
    filterComponent: () => <div></div>,
    render: renderNotesCell,
  };
}

function renderProvenanceNodeCell(data) {
  return (
    <ProvenanceIsolatedNodes nodes={data.provenance}></ProvenanceIsolatedNodes>
  );
}

function renderProvenanceNodeColumn(currentProvenanceData, eventColumnWidth) {
  const eventWidth = 500;
  const eventNodes = currentProvenanceData
    .map((graph) => {
      return graph.provenance.map((node) => node.event);
    })
    .flat()
    .filter((item) => item !== "startedProvenance" && item !== "Finished Task");

  let eventScale = generateCategoricalScale(eventNodes, eventWidth);

  // Create mapping of event types to labels
  const allObj = {};

  Object.keys(eventMapping).forEach((eventKey) => {
    allObj[eventKey] = eventMapping[eventKey].icon;
  });

  return {
    title: "Events Used",
    field: "provGraph",
    width: eventWidth,
    cellStyle: {
      maxWidth: eventWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.provenance.length - b.provenance.length,
    render: renderProvenanceNodeCell,
    customFilterAndSearch: (filterResults, datum) => {
      // https://github.com/mbrn/material-table/pull/1351
      for (let i = 0; i < datum.provenance.length; i++) {
        if (filterResults.includes(datum.provenance[i].event)) {
          return true;
        }
      }
      // unselect any filtered items
      delete datum.tableData.checked;
      return false;
    },
    filterComponent: (props) => (
      <CategoricalFilter
        {...props}
        width={eventWidth}
        scale={eventScale}
        labels={allObj}
        data={eventNodes}></CategoricalFilter>
    ),
  };
}

/* Accuracy */
function renderAccuracyCell(rowData, accuracyScale) {
  return (
    <svg width={100} height={20}>
      <rect
        x={accuracyScale(rowData.answer.accuracy)}
        width={20}
        height={20}></rect>
    </svg>
  );
}

function renderAccuracyColumn(currentProvenanceData, columnWidth) {
  // TODO: Refactor to categorical or Numerical
  let accuracyScale = generateCategoricalScale([1, 0], columnWidth);

  return {
    title: "Accuracy",
    field: "provGraph correct",
    width: columnWidth,
    cellStyle: {
      maxWidth: columnWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.answer.accuracy - b.answer.accuracy,
    render: (rowData) => renderAccuracyCell(rowData, accuracyScale),
    customFilterAndSearch: (filterResults, datum) => {
      // https://github.com/mbrn/material-table/pull/1351
      // TODO: Refactor to categorical or Numerical
      if (filterResults.includes(`${datum.answer.accuracy}`)) {
        return true;
      }
      // if outside of filter, remove from item
      delete datum.tableData.checked;

      return false;
    },

    filterComponent: (props) => (
      <CategoricalFilter
        {...props}
        width={columnWidth}
        scale={accuracyScale}
        labels={{ true: 1, false: 0 }}
        data={currentProvenanceData.map(
          // TODO: fix from hard coded
          (graph) => graph.answer.correct
        )}></CategoricalFilter>
    ),
  };
}

/* Time */
function renderTimeCell(rowData, timeScale) {
  return (
    <svg width={timeScale.range()?.[1]} height={20}>
      <ProvenanceGraph performance={rowData} xScale={timeScale} />
    </svg>
  );
}
function renderTimeColumn(currentProvenanceData, columnWidth) {
  const max = d3.max(currentProvenanceData, (datum) => datum.totalTime);
  const timeScale = d3.scaleLinear().domain([0, max]).range([0, columnWidth]);

  return {
    title: "Time To Complete",
    field: "provGraph",
    width: columnWidth,
    cellStyle: {
      maxWidth: columnWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.totalTime - b.totalTime,
    render: (rowData) => renderTimeCell(rowData, timeScale),
    customFilterAndSearch: (filterResults, datum) => {
      // https://github.com/mbrn/material-table/pull/1351
      if (
        datum.totalTime >= filterResults[0] &&
        datum.totalTime <= filterResults[1]
      ) {
        return true;
      }
      delete datum.tableData.checked;

      return false;
    },

    filterComponent: (props) => (
      <QuantitativeFilter
        {...props}
        xScale={timeScale}
        data={currentProvenanceData.map(
          (graph) => graph.totalTime
        )}></QuantitativeFilter>
    ),
  };
}

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
