//@ts-nocheck
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  ExportPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { GridExporter } from "@devexpress/dx-react-grid-export";

import { pure } from "recompose";
import saveAs from "file-saver";

import ProvenanceGraph from "./ProvenanceGraph";
import * as d3 from "d3";
import TagsInput from "react-tagsinput";
import TagStyles from "./tagstyles.module.css";
import TagWrapper from "./reactTagWrapper";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
import styles from "./ProvenanceTable.module.css";
import { ifError } from "assert";
import _ from "lodash";
import {
  QuantitativeColumn,
  CategoricalColumn,
  ProvenanceColumn,
  NotesColumn,
  LongTextColumn,
} from "./ColumnDefinitions.tsx";
import {
  CodeSandboxCircleFilled,
  PropertySafetyFilled,
} from "@ant-design/icons";
import { Typography } from "@material-ui/core";

const differenceFilter = (firstArray, secondArray) => {
  return firstArray.filter(
    (firstArrayItem) =>
      !secondArray.some(
        (secondArrayItem) =>
          firstArrayItem.columnName === secondArrayItem.columnName
      )
  );
};
function toFixedTrunc(x, n) {
  const v = (typeof x === "string" ? x : x.toString()).split(".");
  if (n <= 0) return v[0];
  let f = v[1] || "";
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += "0";
  return `${v[0]}.${f}`;
}
const GroupCellContentFunc = (props) => {
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
const GroupCellContent = pure(GroupCellContentFunc);
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
function onSave(workbook) {
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "DataGrid.xlsx"
    );
  });
}

function getGroupSummaryValues(props) {
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
  } else if (columnSchema.DATA_TYPE === "text") {
    defaultColumnDefinition = new CategoricalColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData,
      handleFilterChange
    );
  } else if (columnSchema.DATA_TYPE === "longtext") {
    defaultColumnDefinition = new LongTextColumn(
      data,
      columnSchema.COLUMN_NAME,
      columnMetaData,
      handleFilterChange
    );
  } else if (columnSchema.DATA_TYPE === "provenance") {
    defaultColumnDefinition = new ProvenanceColumn(
      data,
      "sequence",
      columnMetaData,
      handleFilterChange
    );
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
  const exporterRef = useRef(null);

  const [filters, setFilters] = React.useState([]);
  const handleFilter = (columnName, value) => {
    const currentFilterIndex = filters.findIndex(
      (filter) => filter.columnName === columnName
    );
    let clonedFilters = [...filters];
    if (currentFilterIndex > -1) {
      clonedFilters[currentFilterIndex] = {
        columnName: columnName,
        value: value,
      };
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

  const [rows, setRows] = useState(provenanceData);
  const startExport = useCallback(
    (options) => {
      exporterRef.current.exportGrid(options);
    },
    [exporterRef]
  );
  // when task ID changes, use new data
  useEffect(() => {
    setRows(provenanceData);
  }, [provenanceData]);
  const [grouping, setGroupingInternal] = useState([]);
  const setGrouping = (newGrouping) => {
    // if an item is recently grouped on, remove any filters for it.
    let newlyAddedGroups = differenceFilter(newGrouping, grouping)?.[0];
    if (newlyAddedGroups) {
      let currentFilter = filters.find(
        (filterItem) => newlyAddedGroups.columnName === filterItem.columnName
      );

      if (!currentFilter) {
        currentFilter = { value: { filterMin: 0.5, filterMax: 1.5 } };
      }
      const newGroupIndex = newGrouping.findIndex(
        (newGroup) => newGroup.columnName === newlyAddedGroups.columnName
      );
      newGrouping[newGroupIndex] = Object.assign(newGrouping[newGroupIndex], {
        groupMetaData: currentFilter.value,
      });
    }
    // search through grouping,
    setGroupingInternal(newGrouping);
    //setFilters(clonedFilters);
  };
  const groupingPredicate = (value, column, filterValue) => {
    // find filter value
    const isRowInTrueGroup = column.customFilterAndSearch(
      { value: filterValue },
      value
    );
    return {
      value: isRowInTrueGroup,
      key: `${column.name}-${isRowInTrueGroup}`,
    };
  };
  const integratedGroupingColumnExtensions = useMemo(
    () => {
      return columns.map((column) => {
        // if quantitative column, group with filter value
        if (column.type === "quantitative") {
          const group = grouping.find(
            (group) => group.columnName === column.name
          );
          let groupingValue = group
            ? group.groupMetaData
            : { filterMin: 0.2, filterMax: 1.2 };

          return {
            columnName: column.name,
            criteria: (value) =>
              groupingPredicate(value, column, groupingValue),
          };
        } else if (column.type === "provenance") {
          const group = grouping.find(
            (group) => group.columnName === column.name
          );
          let groupingValue = group ? group.groupMetaData : null;

          return {
            columnName: column.name,
            criteria: (value) =>
              groupingPredicate(value, column, groupingValue),
          };
        }
        return { columnName: column.name };
      });
    },
    [columns, grouping]

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
  const summaryCalculator = (type, rows, getValue) => {
    if (type === "custom") {
      if (!rows.length) {
        return null;
      }
      return rows;
    }
    return rows;
  };
  const TempRowComponent = (props) => {
    const [hidden, setHidden] = useState(false);
    let groupedRowHeader = `Grouped Row`;
    const columnName = props.row.groupedBy;
    const columnInfo = columns.find((column) => column.name == columnName);
    if (columnInfo) {
      if (columnInfo.type === "quantitative") {
        const groupIndex = grouping.findIndex(
          (group) => group.columnName === columnName
        );
        const group = grouping[groupIndex];

        if (props.row.value === true) {
          // grab values from filters
          groupedRowHeader = `${"---".repeat(
            groupIndex
          )} Grouped on: ${columnName} [${toFixedTrunc(
            group.groupMetaData.filterMin,
            2
          )},${toFixedTrunc(group.groupMetaData.filterMax, 2)}]`;
        } else {
          groupedRowHeader = `${"---".repeat(
            groupIndex
          )} Grouped on: ${columnName} is outside of range [${toFixedTrunc(
            group.groupMetaData.filterMin,
            2
          )}, ${toFixedTrunc(group.groupMetaData.filterMax, 2)}]`;
        }
      } else if (columnInfo.type === "provenance") {
        const groupIndex = grouping.findIndex(
          (group) => group.columnName === columnName
        );
        const group = grouping[groupIndex];

        if (props.row.value === true) {
          // grab values from filters
          groupedRowHeader = `${"---".repeat(
            groupIndex
          )} Grouped on provenance sequence:${group.groupMetaData
            .map((node) => node.label)
            .join(",")}`;
        } else {
          groupedRowHeader = `${"---".repeat(
            groupIndex
          )} Grouped on not containing provenance sequence`;
        }
      } else {
        groupedRowHeader = `${columnName} is ${props.row.value}`;
      }
    }
    return (
      <React.Fragment>
        <tr className={styles.groupHeaderRow}>
          <td colSpan={42} onClick={() => setHidden(!hidden)}>
            <Typography
              className={styles.groupHeaderContent}
              variant={"overline"}>
              {groupedRowHeader}
            </Typography>
          </td>
        </tr>
        {!hidden && (
          <TableGroupRow.Row {...props}>{props.children}</TableGroupRow.Row>
        )}
      </React.Fragment>
    );
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
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
        <TableHeaderRow showGroupingControls />
        <TableSelection showSelectAll />
        <TableFilterRow cellComponent={FilterCells} />
        <TableGroupRow
          rowComponent={TempRowComponent}
          columnExtensions={tableGroupColumnExtension}
          summaryCellComponent={(props) => (
            <GroupCellContent
              columns={columns}
              provenanceData={provenanceData}
              {...props}></GroupCellContent>
          )}
          contentComponent={() => {
            return <div></div>;
          }}
          showColumnsWhenGrouped
          stubCellComponent={(stubProps) => {
            let shouldHideStub = false;
            // if this stub prop matches last grouping, hide it
            // this is used to fix a bug where the inner most grouped row is off by one td

            if (grouping.length > 0) {
              const groupedByRow = stubProps.tableRow.row.groupedBy;
              shouldHideStub =
                grouping[grouping.length - 1].columnName === groupedByRow;
            }
            return (
              <td style={shouldHideStub ? { display: "none" } : null}></td>
            );
          }}
        />
        <Toolbar />
        <ExportPanel startExport={startExport} />

        <ColumnChooser />
        <GroupingPanel showGroupingControls></GroupingPanel>
      </Grid>
      <GridExporter
        ref={exporterRef}
        rows={rows}
        columns={columns}
        onSave={onSave}
        selection={selection}
      />
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
      return (
        <GroupDataResolver incomingData={incomingData}>
          {({ partitionedData }) => {
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
