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
  NotesColumn,
} from "./ColumnDefinitions.tsx";
import { CodeSandboxCircleFilled } from "@ant-design/icons";

const differenceFilter = (firstArray, secondArray) => {
  return firstArray.filter(
    (firstArrayItem) =>
      !secondArray.some(
        (secondArrayItem) => firstArrayItem._user === secondArrayItem._user
      )
  );
};

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
    <VirtualTable.Cell {...restProps} style={{ margin: "16px" }}>
      {item}
    </VirtualTable.Cell>
  );
};

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

function getColumnMetaData(columnKey, columnMetaData) {
  if (columnMetaData[columnKey]) {
    return columnMetaData[columnKey];
  } else {
    return { hideByDefault: true };
  }
}

function generateColumnDefinition(
  columnSchema,
  data,
  columnsMetaData,
  handleFilterChange
) {
  let defaultColumnDefinition;
  const columnMetaData = getColumnMetaData(
    columnSchema.COLUMN_NAME,
    columnsMetaData
  );
  if (columnSchema.DATA_TYPE === "int" || columnSchema.DATA_TYPE === "float") {
    defaultColumnDefinition = new QuantitativeColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData,
      handleFilterChange
    );
  } else if (
    columnSchema.DATA_TYPE === "longtext" ||
    columnSchema.DATA_TYPE === "text"
  ) {
    defaultColumnDefinition = new CategoricalColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData,
      handleFilterChange
    );
  } else if (columnSchema.DATA_TYPE === "provenance") {
    console.log("provenance", columnMetaData);
    defaultColumnDefinition = new ProvenanceColumn(columnMetaData);
  } else if (columnSchema.DATA_TYPE === "tag") {
    defaultColumnDefinition = new NotesColumn(columnMetaData);
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
  handleTagCreation,
}) => {
  console.log("handleProvenanceNodeClick", handleProvenanceNodeClick);
  const [filters, setFilters] = React.useState([]);
  const handleFilter = (columnName, value) => {
    console.log("in handle filter", columnName, value);
    const currentFilterIndex = filters.findIndex(
      (filter) => filter.name === columnName
    );
    const clonedFilters = Object.assign([], filters);
    if (currentFilterIndex > -1) {
      clonedFilters[currentFilterIndex] = { name: columnName, value: value };
    } else {
      clonedFilters.push({ columnName: columnName, value: value });
    }
    setFilters(clonedFilters);
  };
  let columnMetaData = {
    participantID: { order: 1 },
    condition: { order: 2 },
    accuracy: { width: 125, order: 3 },
    time: { width: 200, order: 4 },
    sequence: {
      width: 300,
      order: 5,
      handleProvenanceNodeClick: handleProvenanceNodeClick,
    },
    notes: { width: 200, order: 6, handleTagCreation: handleTagCreation },
  };

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
            columnMetaData,
            handleFilter
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
          columnMetaData
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
  const [selection, setSelectionInternal] = useState([]);

  const setSelection = (selectionIndicies) => {
    setSelectionInternal(selectionIndicies);
  };

  //console.log(provenanceData, ...extraColumnDefinitions, columns);
  const [rows, setRows] = useState(provenanceData);
  const [grouping, setGroupingInternal] = useState([]);
  const setGrouping = (newGrouping) => {
    console.log("grouping", newGrouping, grouping, "dff");
    // if an item is recently grouped on, remove any filters for it.
    const newlyAddedGroups = differenceFilter(newGrouping, grouping);
    const clonedFilters = [...filters].filter(
      (filterItem) =>
        !newlyAddedGroups.some(
          (newGroupItem) => newGroupItem.columnName === filterItem.columnName
        )
    );
    setFilters(clonedFilters);
    // search through grouping,
    setGroupingInternal(newGrouping);
  };
  const quantitativePredicate = (value, column) => {
    // find filter value
    console.log("in quant pred", value, column);
    const filterIndex = filters.findIndex(
      (filter) => filter.name === column.name
    );
    let filterValue =
      filterIndex > -1
        ? filters[filterIndex].value
        : { filterMin: 0.6, filterMax: 1.2 };
    const isRowInTrueGroup = column.customFilterAndSearch(
      { value: filterValue },
      value
    );
    return {
      value: isRowInTrueGroup,
      key: `${column.name}-${isRowInTrueGroup}`,
    };
  };
  console.log("dywootto group", rows, columns);
  const [integratedGroupingColumnExtensions] = useState(
    columns.map((column) => {
      // if quantitative column, group with filter value
      if (column.type && column.type === "quantitative") {
        return {
          columnName: column.name,
          criteria: (value) => quantitativePredicate(value, column),
        };
      }
      return { columnName: column.name };
    })
    // { columnName: "visType", criteria: nameGroupCriteria },
    //{ columnName: "answer", criteria: (data) => data.accuracy > 0.5 },
  );
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
      console.log("in custom filter", column);
      return {
        columnName: column.name,
        predicate: (value, filter, row) => {
          console.log("in predicate filter", value, filter, row);
          //if (!filter.value.length) return true;
          if (column.customFilterAndSearch) {
            return column.customFilterAndSearch(filter, value, row);
          }
          return IntegratedFiltering.defaultPredicate(value, filter, row);
        },
      };
    })
  );
  console.log("filteringColumnExtensions", filteringColumnExtensions);

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
  console.log("current filters", filters);
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
        <FilteringState filters={filters} onFiltersChange={setFilters} />
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
          stubCellComponent={(stubProps) => {
            console.log(stubProps, grouping);
            let shouldHideStub = false;
            // if this stub prop matches last grouping

            if (grouping.length > 0) {
              const groupedByRow = stubProps.tableRow.row.groupedBy;
              console.log(grouping[grouping.length - 1], groupedByRow);
              shouldHideStub =
                grouping[grouping.length - 1].columnName === groupedByRow;
            }
            return (
              <td
                className="FAKETD"
                style={shouldHideStub ? { display: "none" } : null}></td>
            );
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
