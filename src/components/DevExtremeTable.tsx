//@ts-nocheck
import React, { useState, useEffect, forwardRef, useMemo } from "react";
import Paper from "@material-ui/core/Paper";
import {
  GroupingState,
  SelectionState,
  IntegratedSelection,
  IntegratedGrouping,
  FilteringState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableGroupRow,
  TableSelection,
  GroupingPanel,
  Toolbar,
  DragDropProvider,
  TableFilterRow,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";

import ProvenanceGraph from "./ProvenanceGraph";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import * as d3 from "d3";
import TagsInput from "react-tagsinput";
import eventMapping from "./eventMapping";
import TagStyles from "./tagstyles.module.css";
import TagWrapper from "./reactTagWrapper";
import { TimeFilter, CategoricalFilter } from "./TableFilters";
import tableStyles from "./ProvenanceTable.module.css";
import { ifError } from "assert";

const GroupCellContent = ({ row, ...restProps }) => (
  <TableGroupRow.Content {...restProps}>
    from {row.value.from} to {row.value.to}
  </TableGroupRow.Content>
);

const nameGroupCriteria = (value) => {
  const firstLetter = String(value).substr(0, 1).toLowerCase();
  const groupValue =
    firstLetter < "n" ? { from: "A", to: "M" } : { from: "N", to: "Z" };
  return {
    value: groupValue,
    key: `${groupValue.from}-${groupValue.to}`,
  };
};
const FilterCells = ({ value, other, ...restProps }) => {
  console.log(value, other, restProps);
  let Item; //= () => <div></div>;
  let itemProps = Object.assign({}, restProps);
  if (restProps.column.filterComponent) {
    itemProps["onFilter"] = restProps.onFilter;
    Item = restProps.column.filterComponent;
    //Item = (props) => <NewItem {...props}></NewItem>;
  } else {
    Item = (props) => <TableFilterRow.Cell {...props}></TableFilterRow.Cell>;
  }
  return (
    <VirtualTable.Cell style={{ width: "100%" }}>
      <Item {...itemProps}></Item>
    </VirtualTable.Cell>
  );
};
const ProvenanceCells = ({ value, style, ...restProps }) => {
  console.log(value, style, restProps);
  let item;
  if (restProps.column.render) {
    item = restProps.column.render(restProps.row);
  }
  return (
    <VirtualTable.Cell
      {...restProps}
      style={{
        backgroundColor: value < 5000 ? "red" : undefined,
        ...style,
      }}>
      {item}
    </VirtualTable.Cell>
  );
};

const DevExtremeTable = ({ provenanceData }) => {
  const [selection, setSelection] = useState([]);

  // Column Defs
  const [userIdColumnDefinition, setUserIdColumnDefinition] = useState(
    renderUserIdColumn(provenanceData, 150)
  );

  const [stimulusColumnDefinition, setStimulusColumnDefinition] = useState(
    renderStimulusDefinition(provenanceData, 150)
  );

  const [timeColumnDefinition, setTimeColumnDefinition] = useState(
    renderTimeColumn(provenanceData, 300)
  );

  const [accuracyColumnDefinition, setAccuracyColumnDefinition] = useState(
    renderAccuracyColumn(provenanceData, 100)
  );

  const [eventsColumnDefinition, setEventsColumnDefinition] = useState(
    renderProvenanceNodeColumn(provenanceData, 1000)
  );

  const [notesColumnDefinition, setNotesColumnDefinition] = useState(
    renderNotesColumn(200)
  );

  React.useEffect(() => {
    setTimeColumnDefinition(renderTimeColumn(provenanceData, 250));
    setAccuracyColumnDefinition(renderAccuracyColumn(provenanceData, 100));
    setEventsColumnDefinition(renderProvenanceNodeColumn(provenanceData, 500));
    //setNotesColumnDefinition(renderNotesColumn(200));
    setRows(provenanceData);
    setColumns([
      userIdColumnDefinition,
      stimulusColumnDefinition,
      timeColumnDefinition,
      accuracyColumnDefinition,
      eventsColumnDefinition,
    ]);
  }, [provenanceData]);

  const [columns, setColumns] = useState([
    userIdColumnDefinition,
    stimulusColumnDefinition,
    timeColumnDefinition,
    accuracyColumnDefinition,
    eventsColumnDefinition,
    //notesColumnDefinition,
  ]);
  const [rows, setRows] = useState(provenanceData);
  const [grouping, setGrouping] = useState([]);
  const [integratedGroupingColumnExtensions] = useState([
    { columnName: "visType", criteria: nameGroupCriteria },
    { columnName: "answer", criteria: (data) => data.accuracy > 0.5 },
  ]);
  const [tableGroupColumnExtension] = useState([
    { columnName: "visType", showWhenGrouped: true },
    { columnName: "answer", showWhenGrouped: true },
  ]);

  const [defaultColumnWidths] = useState(
    columns.map((column) => {
      return {
        columnName: column.name,
        width: column.width ? column.width : 100,
      };
    })
  );
  console.log("column widthss", defaultColumnWidths);

  const [filteringColumnExtensions] = useState(
    columns.map((column) => {
      return {
        columnName: column.name,
        predicate: (value, filter, row) => {
          //if (!filter.value.length) return true;
          console.log(value, filter, row);
          if (column.customFilterAndSearch) {
            return column.customFilterAndSearch(filter, value, row);
          }
          return IntegratedFiltering.defaultPredicate(value, filter, row);
        },
      };
    })
  );

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <DragDropProvider />

        <GroupingState
          grouping={grouping}
          onGroupingChange={setGrouping}
          columnGroupingEnabled
          columnExtensions={tableGroupColumnExtension}
          //defaultExpandedGroups={["N-Z"]}
        />
        <IntegratedGrouping
          columnExtensions={integratedGroupingColumnExtensions}
        />

        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering
          columnExtensions={filteringColumnExtensions}></IntegratedFiltering>

        <SelectionState
          selection={selection}
          onSelectionChange={setSelection}
        />
        <IntegratedSelection />

        <VirtualTable cellComponent={ProvenanceCells} height={1000} />
        <TableColumnResizing columnWidths={defaultColumnWidths} />

        <TableHeaderRow showGroupingControls />
        <TableSelection showSelectAll />
        <TableFilterRow cellComponent={FilterCells} />
        <TableGroupRow
          columnExtensions={tableGroupColumnExtension}
          contentComponent={GroupCellContent}
        />
        <Toolbar />
        <GroupingPanel showGroupingControls></GroupingPanel>
      </Grid>
    </Paper>
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
    name: "visType",
    render: (rowData) => <span>{rowData.visType}</span>,
    width: stimulusColumnWidth,
  };
}

function renderUserIdColumn(provenanceData, userIdColumnWidth) {
  console.log(provenanceData);
  return {
    title: "User Id",
    name: "workerID",
    render: (rowData) => <span>{rowData.workerID}</span>,
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
    name: "None",
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
/**
 *
 * @param filter
 * @param value
 * @param accesssor
 */
function filterCategoricalValue(filter, value, accesssor) {
  console.log(filter, value, accesssor);
  if (!Array.isArray(value)) {
    value = [value];
  }
  // for each value
  let newValues = value;
  console.log(newValues);
  if (accesssor) {
    newValues = newValues.map(accesssor);
  }
  console.log(newValues, Object.values(filter));
  for (let i = 0; i < newValues.length; i++) {
    if (Object.values(filter).includes(newValues[i])) {
      return true;
    }
  }
  return false;
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
    name: "provenance",
    width: eventWidth,
    cellStyle: {
      maxWidth: eventWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.provenance.length - b.provenance.length,
    render: renderProvenanceNodeCell,
    customFilterAndSearch: (filter, value, row) => {
      return filterCategoricalValue(filter, value, (node) => node.event);
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
  let accuracyScale = generateCategoricalScale(["1", "0"], columnWidth);

  return {
    title: "Accuracy",
    name: "answer",
    width: columnWidth,
    cellStyle: {
      maxWidth: columnWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.answer.accuracy - b.answer.accuracy,
    render: (rowData) => renderAccuracyCell(rowData, accuracyScale),
    customFilterAndSearch: (filter, value, row) => {
      return filterCategoricalValue(
        filter,
        value,
        (answer) => `${answer.accuracy}`
      );
      /*console.log(filter, value, row);
      // https://github.com/mbrn/material-table/pull/1351
      // TODO: Refactor to categorical or Numerical
      if (value.includes(`${row.answer.accuracy}`)) {
        return true;
      }
      // if outside of filter, remove from item
      //delete datum.tableData.checked;

      return false;*/
    },

    filterComponent: (props) => (
      <CategoricalFilter
        {...props}
        width={columnWidth}
        scale={accuracyScale}
        labels={{ "1": "true", "0": "false" }}
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
    name: "time",
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
      <TimeFilter
        {...props}
        xScale={timeScale}
        data={currentProvenanceData.map(
          (graph) => graph.totalTime
        )}></TimeFilter>
    ),
  };
}

export default DevExtremeTable;
