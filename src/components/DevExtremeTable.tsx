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
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
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

const extraColumns = [
  {
    title: "Confidence",
    name: "answerConfidence",
    type: "quantitative",
    accessor: (participant) => {
      return parseInt(participant.feedback.confidence);
    },
  },
  {
    title: "Difficulty",
    name: "taskDifficulty",
    type: "quantitative",
    accessor: (participant) => {
      return parseInt(participant.feedback.difficulty);
    },
  },
  {
    title: "Answer Text",
    name: "answerText",
    type: "string",
    accessor: (participant) => {
      return participant.answer.value !== ""
        ? participant.answer.value
        : participant.answer.nodes;
    },
  },
];

const DevExtremeTable = ({ provenanceData }) => {
  console.log(provenanceData);
  // map extra columns for now
  provenanceData = useMemo(
    () =>
      provenanceData.map((participant) => {
        extraColumns.forEach((extraColumn) => {
          participant[extraColumn.name] = {
            type: extraColumn.type,
            value: extraColumn.accessor(participant),
          };
        });
        return participant;
      }),
    [provenanceData]
  );
  console.log(provenanceData, extraColumns);
  const extraColumnDefinitions = useMemo(() => {
    let tempColumns = [];

    for (let columnIndex in extraColumns) {
      let column = extraColumns[columnIndex];
      console.log(column);

      if (column.type === "string") {
        tempColumns.push({
          title: column.title,
          name: column.name,
          render: (rowData) => <span>{rowData[column.name].value}</span>,
          width: 100,
        });
      } else if (column.type === "quantitative") {
        const quantWidth = 300;
        const max = d3.max(provenanceData, (datum) => datum[column.name].value);
        const timeScale = d3
          .scaleLinear()
          .domain([0, max])
          .range([0, quantWidth]);

        tempColumns.push({
          title: column.title,
          name: column.name,
          width: quantWidth,
          customSort: (a, b) => a[column.name].value - b[column.name].value,
          render: (rowData) => <span>{rowData[column.name].value}</span>, //renderTimeCell(rowData, timeScale),
          customFilterAndSearch: (filter, value, row) => {
            return filterQuantitativeValues(filter, value.value, row);
          },
          filterComponent: (props) => (
            <QuantitativeFilter
              {...props}
              xScale={timeScale}
              data={provenanceData.map(
                (datum) => datum[column.name].value
              )}></QuantitativeFilter>
          ),
        });
      }
    }
    return tempColumns;
  });
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
      ...extraColumnDefinitions,
    ]);
  }, [provenanceData]);

  const [columns, setColumns] = useState([
    userIdColumnDefinition,
    stimulusColumnDefinition,
    timeColumnDefinition,
    accuracyColumnDefinition,
    eventsColumnDefinition,
    ...extraColumnDefinitions,
    //notesColumnDefinition,
  ]);
  console.log(provenanceData, ...extraColumnDefinitions, columns);
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

  const [filteringColumnExtensions] = useState(
    columns.map((column) => {
      return {
        columnName: column.name,
        predicate: (value, filter, row) => {
          //if (!filter.value.length) return true;
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
  if (!Array.isArray(value)) {
    value = [value];
  }
  // for each value
  let newValues = value;
  if (accesssor) {
    newValues = newValues.map(accesssor);
  }
  for (let i = 0; i < newValues.length; i++) {
    if (Object.values(filter).includes(newValues[i])) {
      return true;
    }
  }
  return false;
}
function filterQuantitativeValues(filter, value, row) {
  console.log(filter, value);
  if (value >= filter.filterMin && value <= filter.filterMax) {
    return true;
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
    name: "totalTime",
    width: columnWidth,
    cellStyle: {
      maxWidth: columnWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.totalTime - b.totalTime,
    render: (rowData) => renderTimeCell(rowData, timeScale),
    customFilterAndSearch: (filter, value, row) => {
      return filterQuantitativeValues(filter, value, row);
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

export default DevExtremeTable;
