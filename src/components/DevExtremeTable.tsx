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
  IntegratedSummary,
  SummaryState,
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
  ColumnChooser,
  TableColumnVisibility,
  TableSummaryRow,
} from "@devexpress/dx-react-grid-material-ui";

import ProvenanceGraph from "./ProvenanceGraph";
import * as d3 from "d3";
import TagsInput from "react-tagsinput";
import eventMapping from "./eventMapping";
import TagStyles from "./tagstyles.module.css";
import TagWrapper from "./reactTagWrapper";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
import tableStyles from "./ProvenanceTable.module.css";
import { ifError } from "assert";
import _ from "lodash";
import {
  QuantitativeColumn,
  CategoricalColumn,
  ProvenanceColumn,
} from "./ColumnDefinitions.tsx";
const GroupCellContent = (props) => {
  console.log("props for group cell", props);

  const { provenanceData, column, row, children } = props;
  const groupData = children.props.columnSummaries[0].value;

  let Content = () => <div></div>;
  if (column.groupedSummaryComponent) {
    Content = column.groupedSummaryComponent;
  }

  return (
    <TableSummaryRow.GroupCell {...props}>
      <Content incomingData={groupData} partitionedData={groupData}></Content>
    </TableSummaryRow.GroupCell>
  );
};
const GroupRowContent = (props) => {
  return (
    <div>
      <p>Hello this is a test</p>
      <TableGroupRow.Row {...props}></TableGroupRow.Row>
    </div>
  );
};

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
    <VirtualTable.Cell {...restProps} style={style}>
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
function getGroupSummaryValues(props) {
  console.log(props);
  //const { selection, rows, totalSummaryItems } = this.state;
  //const selectionSet = new Set(selection);
  //const selectedRows = rows.filter((row, rowIndex) => selectionSet.has(rowIndex));
  return rows; /*totalSummaryItems.map((summary) => {
      const { columnName, type } = summary;
      return IntegratedSummary.defaultCalculator(type, selectedRows, row => row[columnName]);
    });*/
}
// must use non zero order else !order is true
let columnMetaData = {
  participantID: { order: 1 },
  condition: { order: 2 },
  accuracy: { width: 75, order: 3 },
  time: { width: 200, order: 4 },
  sequence: { width: 300, order: 5 },
};

function getColumnMetaData(columnKey) {
  if (columnMetaData[columnKey]) {
    return columnMetaData[columnKey];
  } else {
    return { hideByDefault: true };
  }
}

function generateColumnDefinition(
  columnSchema,
  data,
  handleProvenanceNodeClick
) {
  let defaultColumnDefinition;
  const columnMetaData = getColumnMetaData(columnSchema.COLUMN_NAME);
  if (columnSchema.DATA_TYPE === "int" || columnSchema.DATA_TYPE === "float") {
    /*return {
      title: columnSchema.COLUMN_NAME,
      name: columnSchema.COLUMN_NAME,
      render: (rowData) => <span>{rowData[columnSchema.COLUMN_NAME]}</span>,
      width: 100,
    };*/
    console.log("Quant", columnSchema.COLUMN_NAME);

    defaultColumnDefinition = new QuantitativeColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData
    );
  } else if (
    columnSchema.DATA_TYPE === "longtext" ||
    columnSchema.DATA_TYPE === "text"
  ) {
    defaultColumnDefinition = new CategoricalColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData
    );
  } else if (columnSchema.DATA_TYPE === "provenance") {
    defaultColumnDefinition = new ProvenanceColumn(
      data,
      handleProvenanceNodeClick,
      columnMetaData
    );
  } else if (columnSchema.DATA_TYPE === "tag") {
    defaultColumnDefinition = new CategoricalColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData
    );
    /*
    defaultColumnDefinition = {
      title: columnSchema.COLUMN_NAME,
      name: columnSchema.COLUMN_NAME,
      render: (rowData) => <span>{"tag"}</span>,
      width: 100,
    };*/
  } else {
    console.error(
      `[DevExtremeTable.tsx] ERROR: Column Schema contains unkown column type ${columnSchema.DATA_TYPE}.`
    );
  }

  return defaultColumnDefinition;
}
const DevExtremeTable = ({
  provenanceData,
  handleProvenanceNodeClick,
  tableSchema,
}) => {
  console.log(provenanceData);
  // map through the provided schema creating the column definitions

  // float, int -> quantitative, histogram filterable and groupable
  // text, long text -> categorical, searchable and groupable
  // event counts -> custom,
  // provenance -> custom,

  /*provenanceData = useMemo(
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
  );*/

  /*
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
        const xScale = d3.scaleLinear().domain([0, max]).range([0, quantWidth]);

        tempColumns.push({
          title: column.title,
          name: column.name,
          width: quantWidth,
          customSort: (a, b) => a[column.name].value - b[column.name].value,
          render: (rowData) => <span>{rowData[column.name].value}</span>, //renderTimeCell(rowData, timeScale),
          customFilterAndSearch: (filter, value, row) => {
            return filterQuantitativeValues(filter, value.value, row);
          },
          groupedSummaryComponent: ({ incomingData }) => {
            console.log("dywootto", incomingData);
            return (
              <GroupDataResolver incomingData={incomingData}>
                {({ partitionedData }) => {
                  if (partitionedData.length === 0) {
                    return <div></div>;
                  }
                  return (
                    <QuantitativeFilter
                      xScale={xScale}
                      data={partitionedData.map(
                        (datum) => datum[column.name].value
                      )}></QuantitativeFilter>
                  );
                }}
              </GroupDataResolver>
            );
          },
          filterComponent: (props) => (
            <QuantitativeFilter
              {...props}
              xScale={xScale}
              data={provenanceData.map(
                (datum) => datum[column.name].value
              )}></QuantitativeFilter>
          ),
        });
      }
    }
    return tempColumns;
  });
  */

  const [selection, setSelection] = useState([]);
  /*
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
    renderProvenanceNodeColumn(provenanceData, 1000, handleProvenanceNodeClick)
  );

  const [notesColumnDefinition, setNotesColumnDefinition] = useState(
    renderNotesColumn(200)
  );*/

  React.useEffect(() => {
    /*
    setTimeColumnDefinition(renderTimeColumn(provenanceData, 250));
    setAccuracyColumnDefinition(renderAccuracyColumn(provenanceData, 100));
    setEventsColumnDefinition(renderProvenanceNodeColumn(provenanceData, 500));
    //setNotesColumnDefinition(renderNotesColumn(200));
    setRows(provenanceData);*/

    setColumns(
      tableSchema
        .map((columnSchema) =>
          generateColumnDefinition(
            columnSchema,
            provenanceData,
            handleProvenanceNodeClick
          ).generateColumnObject()
        )
        .sort((a, b) => {
          console.log("comparator", a, b, a.order, b.order);

          if (!a.order) {
            return 1;
          }
          if (!b.order) {
            return -1;
          }
          return a.order > b.order ? 1 : -1;
        })
    );
  }, [provenanceData]);

  const [columns, setColumns] = useState(
    tableSchema
      .map((columnSchema) =>
        generateColumnDefinition(
          columnSchema,
          provenanceData,
          handleProvenanceNodeClick
        ).generateColumnObject()
      )
      .sort((a, b) => {
        console.log("comparator", a, b, a.order, b.order);

        if (!a.order) {
          return 1;
        }
        if (!b.order) {
          return -1;
        }
        return a.order > b.order ? 1 : -1;
      })
  );
  console.log(columns);

  //console.log(provenanceData, ...extraColumnDefinitions, columns);
  const [rows, setRows] = useState(provenanceData);
  const [grouping, setGroupingInternal] = useState([]);
  const setGrouping = (grouping) => {
    console.log(grouping);
    setGroupingInternal(grouping);
  };
  console.log("dywootto group", rows, columns);
  const [integratedGroupingColumnExtensions] = useState([
    // { columnName: "visType", criteria: nameGroupCriteria },
    //{ columnName: "answer", criteria: (data) => data.accuracy > 0.5 },
  ]);
  const [tableGroupColumnExtension] = useState([
    columns.map((column) => ({
      columnName: column.name,
      showWhenGrouped: true,
    })),
    //  { columnName: "visType", showWhenGrouped: true },
    // { columnName: "answer", showWhenGrouped: true },
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

  const [groupSummaryItems] = useState(
    columns.map((column) => {
      return {
        name: column.name,
        columnName: column.name,
        type: "custom",
        showInGroupFooter: false,
        alignByColumn: true,
      };
    })
  );

  const [defaultHiddenColumnNames] = useState(
    columns
      .filter((column) => column.hideByDefault)
      .map((column) => column.name)
  );
  console.log("default", defaultHiddenColumnNames);
  const summaryCalculator = (type, rows, getValue) => {
    console.log("dywootto rows for group", rows);

    if (type === "custom") {
      if (!rows.length) {
        return null;
      }
      return rows;
    }
    return rows;
  };

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <DragDropProvider />
        <GroupingState
          grouping={grouping}
          onGroupingChange={setGrouping}
          columnGroupingEnabled
          columnExtensions={tableGroupColumnExtension}
        />
        <SummaryState groupItems={groupSummaryItems} />
        <IntegratedGrouping
          columnExtensions={integratedGroupingColumnExtensions}
        />
        <IntegratedSummary calculator={summaryCalculator} />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering
          columnExtensions={filteringColumnExtensions}></IntegratedFiltering>
        <SelectionState
          selection={selection}
          onSelectionChange={setSelection}
        />
        <IntegratedSelection />
        <VirtualTable cellComponent={ProvenanceCells} height={1000} />
        <TableColumnVisibility
          defaultHiddenColumnNames={defaultHiddenColumnNames}
        />
        <TableColumnResizing columnWidths={defaultColumnWidths} />
        <TableHeaderRow showGroupingControls />
        <TableSelection showSelectAll />
        <TableFilterRow cellComponent={FilterCells} />
        <TableGroupRow
          columnExtensions={tableGroupColumnExtension}
          summaryCellComponent={(props) => (
            <GroupCellContent
              columns={columns}
              provenanceData={provenanceData}
              {...props}></GroupCellContent>
          )}
          showColumnsWhenGrouped
          stubCellComponent={() => {
            return <td className="FAKETD" style={{ display: "none" }}></td>;
          }}
          inlineSummaryComponent={() => {
            return <div>temp div testing</div>;
          }}
        />
        <Toolbar />
        <ColumnChooser />
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
    groupedSummaryComponent: () => <div></div>,
  };
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

function renderProvenanceNodeColumn(
  currentProvenanceData,
  eventColumnWidth,
  handleProvenanceNodeClick
) {
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

  const ProvenanceSummary = ({ incomingData }) => {
    const [partitionedData, setPartitionedData] = useState([]);
    useEffect(() => {
      if (incomingData && incomingData.length > 0) {
        setPartitionedData(incomingData);
      }
    }, incomingData);

    console.log(partitionedData);
    const partitionedNodes = partitionedData
      .map((graph) => {
        return graph.provenance.map((node) => node.event);
      })
      .flat()
      .filter(
        (item) => item !== "startedProvenance" && item !== "Finished Task"
      );
    if (partitionedNodes.length === 0) {
      return <div></div>;
    }
    return (
      <CategoricalFilter
        width={eventWidth}
        scale={eventScale}
        labels={allObj}
        data={partitionedNodes}></CategoricalFilter>
    );
  };

  return {
    title: "Events Used",
    name: "provenance",
    width: eventWidth,
    cellStyle: {
      maxWidth: eventWidth,
      padding: "4px 16px",
    },
    customSort: (a, b) => a.provenance.length - b.provenance.length,
    render: (renderData) =>
      renderProvenanceNodeCell(renderData, handleProvenanceNodeClick),
    customFilterAndSearch: (filter, value, row) => {
      return filterCategoricalValue(filter, value, (node) => node.event);
    },
    groupedSummaryComponent: ({ incomingData }) => {
      console.log("dywootto", incomingData);
      return (
        <GroupDataResolver incomingData={incomingData}>
          {({ partitionedData }) => {
            const partitionedNodes = partitionedData
              .map((graph) => {
                return graph.provenance.map((node) => node.event);
              })
              .flat()
              .filter(
                (item) =>
                  item !== "startedProvenance" && item !== "Finished Task"
              );
            if (partitionedNodes.length === 0) {
              return <div></div>;
            }
            return (
              <CategoricalFilter
                width={eventWidth}
                scale={eventScale}
                labels={allObj}
                data={partitionedNodes}></CategoricalFilter>
            );
          }}
        </GroupDataResolver>
      );
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

const GroupDataResolver = (props) => {
  const { incomingData, children } = props;
  const [partitionedData, setPartitionedData] = useState([]);
  useEffect(() => {
    if (incomingData && incomingData.length > 0) {
      setPartitionedData(incomingData);
    }
  }, incomingData);
  if (_.isFunction(children)) {
    return children({ partitionedData });
  }
  return <div></div>;
};

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
    groupedSummaryComponent: ({ incomingData }) => {
      console.log("dywootto", incomingData);
      return (
        <GroupDataResolver incomingData={incomingData}>
          {({ partitionedData }) => {
            console.log(partitionedData);
            if (partitionedData.length === 0) {
              return <div></div>;
            }
            return (
              <CategoricalFilter
                width={columnWidth}
                scale={accuracyScale}
                labels={{ "1": "true", "0": "false" }}
                data={partitionedData.map(
                  // TODO: fix from hard coded
                  (graph) => graph.answer.correct
                )}></CategoricalFilter>
            );
          }}
        </GroupDataResolver>
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
    groupedSummaryComponent: ({ incomingData }) => {
      console.log("dywootto", incomingData);
      return (
        <GroupDataResolver incomingData={incomingData}>
          {({ partitionedData }) => {
            if (partitionedData.length === 0) {
              return <div></div>;
            }
            return (
              <QuantitativeFilter
                xScale={timeScale}
                data={partitionedData.map(
                  (graph) => graph.totalTime
                )}></QuantitativeFilter>
            );
          }}
        </GroupDataResolver>
      );
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
