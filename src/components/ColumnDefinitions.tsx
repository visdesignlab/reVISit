import React, { useState, useEffect, useMemo } from "react";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
import * as d3 from "d3";
import TagWrapper from "./reactTagWrapper";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import EventSearch from "./EventSearch";
import Tagger from "./Tagger";
import { getTopPatternsForGroup } from "../fetchers/fetchMocks.js";
import { useFetchAPIData } from "../hooks/hooks";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import { pure } from "recompose";

const columnOverrides = {};
const filterQuantitativeValues = (filter, value) =>
  value >= filter.filterMin && value <= filter.filterMax;

const QuantitativeCell = ({ rowData, name, commonScale }) => {
  let additionalComponents;
  const cellHeight = 20;
  if (name === "time" && rowData?.sequence) {
    // map through requences
    additionalComponents = rowData.sequence.map((node) => {
      return (
        <rect
          width={3}
          x={commonScale(node.time)}
          height={cellHeight}
          opacity={0.25}></rect>
      );
    });
  }
  return (
    <svg width={commonScale.range()?.[1]} height={cellHeight}>
      <rect
        fill={"gray"}
        width={commonScale(rowData[name])}
        height={cellHeight}></rect>
      {additionalComponents}
    </svg>
  );
};
export class NotesColumn {
  constructor(metaData) {
    this.width = metaData.width;
    this.handleTagCreation = metaData.handleTagCreation;
    this.selectionIndicies = [];
  }
  generateColumnObject() {
    return {
      title: "Notes",
      name: "None",
      cellStyle: {
        padding: "4px 16px",
      },
      width: this.width,
      customSort: (a, b) => b.tags.length - a.tags.length,
      filterComponent: () => <div></div>,
      render: (rowData) => {
        if (!Array.isArray(rowData.tags)) {
          rowData.tags = [];
        }
        return (
          <TagWrapper
            id={generateRowId(rowData)}
            tags={rowData.tags}
            onTagChange={(action, tag) => {
              if (action === "Add") {
                rowData.tags.push(tag);
              } else {
                const index = rowData.tags.findIndex((iterTag) => {
                  return iterTag.name === tag[0]?.name;
                });
                if (index > -1) {
                  rowData.tags.splice(index, 1);
                }
              }

              this.handleTagCreation(
                rowData.participantID,
                rowData.taskID,
                tag,
                action
              );
            }}></TagWrapper>
        );
      },
    };
  }
}
function generateRowId(rowData) {
  return `row${rowData["id"]}`;
}
export class LongTextColumn {
  constructor(data, name, metaData) {
    this.name = name;
    this.data = data;
    this.width = metaData.width ? metaData.width : 300;
    this.order = metaData.order;
    this.hideByDefault = metaData.hideByDefault;
  }

  generateColumnObject() {
    return {
      title: this.name,
      name: this.name,
      render: (rowData) => {
        return (
          <div style={{ "white-space": "normal" }}>
            <Tagger
              text={rowData[this.name]}
              tagDivId={`${generateRowId(rowData)}`}
              rowData={rowData}></Tagger>
          </div>
        );
      },
      width: this.width,
      hideByDefault: this.hideByDefault,
      order: this.order,
    };
  }
}
export class CategoricalColumn {
  constructor(data, name, metaData) {
    this.name = name;
    this.data = data;
    this.width = metaData.width ? metaData.width : 100;
    this.order = metaData.order;
    this.hideByDefault = metaData.hideByDefault;
  }

  generateColumnObject() {
    return {
      title: this.name,
      name: this.name,
      render: (rowData) => {
        return (
          <span>{rowData[this.name] ? rowData[this.name] : this.name}</span>
        );
      },
      width: this.width,
      hideByDefault: this.hideByDefault,
      order: this.order,
    };
  }
}
export class QuantitativeColumn {
  constructor(data, name, metaData, handleFilterChange) {
    this.name = name;
    this.data = data;
    this.type = "quantitative";
    this.height = 42.5;
    this.width = metaData.width ? metaData.width : 100;
    this.order = metaData.order;
    this.hideByDefault = metaData.hideByDefault;
    this.customSort = (a, b) => a[this.name] - b[this.name];
    this.handleFilterChange = handleFilterChange;
    this.customFilterAndSearch = (filter, value) => {
      return filterQuantitativeValues(filter.value, value);
    };
    this.cellComponent = (rowData) => {
      return (
        <QuantitativeCell
          rowData={rowData}
          name={this.name}
          commonScale={this.xScale}></QuantitativeCell>
      );
    };
    let [min, max] = d3.extent(this.data, (datum) => datum[this.name]);
    if (min > 0) {
      min = 0;
    }

    this.xScale = d3
      .scaleLinear()
      .domain([min - 0.001, max + 0.001])
      .range([10, this.width - 20]); // offset from sides
    this.yScale = d3.scaleLinear().range([this.height, 0]);
    // the scale
    let niceX = this.xScale.nice();
    const binner = d3.histogram().domain(niceX.domain());
    const buckets = binner(data.map((datum) => datum[this.name]));
    this.yScale = this.yScale.domain([
      0,
      d3.max(buckets, (bucket) => bucket.length),
    ]);
    this.buckets = buckets;
  }

  set setWidth(newWidth) {
    this.width = newWidth;
    this.scale.range([0, this.width]);
  }

  set setRender(Component) {
    this.cellComponent = Component;
  }

  generateColumnObject() {
    return {
      title: this.name,
      name: this.name,
      width: this.width,
      type: this.type,
      customSort: this.customSort,
      render: this.cellComponent,
      order: this.order,
      hideByDefault: this.hideByDefault,
      customFilterAndSearch: this.customFilterAndSearch,
      groupedSummaryComponent: ({ incomingData }) => {
        return (
          <div style={{ pointerEvents: "all", opacity: 0.7 }}>
            <GroupDataResolver incomingData={incomingData}>
              {({ partitionedData }) => {
                if (partitionedData.length === 0) {
                  return <div></div>;
                }
                return (
                  <QuantitativeFilter
                    xScale={this.xScale}
                    yScale={this.yScale}
                    buckets={this.buckets}
                    height={this.height}
                    data={partitionedData.map(
                      (datum) => datum[this.name]
                    )}></QuantitativeFilter>
                );
              }}
            </GroupDataResolver>
          </div>
        );
      },
      filterComponent: (props) => {
        return (
          <QuantitativeFilter
            {...props}
            xScale={this.xScale}
            yScale={this.yScale}
            buckets={this.buckets}
            height={this.height}
            onFilter={(filter, value, row) => {
              return this.handleFilterChange(this.name, filter);
            }}
            data={this.data.map(
              (datum) => datum[this.name]
            )}></QuantitativeFilter>
        );
      },
    };
  }
}

function hasSubArrayStrict(master, sub) {
  return master.join(",").indexOf(sub.join(",")) > -1;
}

function hasSubArrayNonStrict(master, sub) {
  return sub.every(((i) => (v) => (i = master.indexOf(v, i) + 1))(0));
}

const EventsSummary = (props) => {
  let { incomingData } = props;
  incomingData = incomingData?.incomingData;
  if (!incomingData || !incomingData[0]) {
    return <div></div>;
  }

  return <EventSearch onFilter={props.onFilter}></EventSearch>;
};

/* */
function filterEvents(filterValue, rowValue) {
  if (!filterValue || !rowValue) {
    return true;
  }
  return hasSubArrayNonStrict(
    rowValue.map((val) => val.name),
    filterValue.map((val) => val.id)
  ); //rowValue.length >= 5;
}
const GroupedContainer = (props) => {
  if (
    typeof props.children === "undefined" ||
    typeof props.children !== "function"
  ) {
    return <div></div>;
  }
  return (
    <div style={{ pointerEvents: "none", opacity: 0.7 }}>
      {props.children()}
    </div>
  );
};
export class ProvenanceColumn {
  constructor(data, name, metaData, handleFilterChange) {
    this.name = name;
    this.width = 300;
    this.data = data;
    this.handleProvenanceNodeClick = metaData.handleProvenanceNodeClick;
    this.handleFilterChange = handleFilterChange;
    this.customFilterAndSearch = (filter, value) => {
      return filterEvents(filter.value, value);
    };
  }
  generateColumnObject() {
    return {
      title: "Events Used",
      name: this.name,
      width: this.width,
      customSort: (a, b) => a.sequence.length - b.sequence.length,
      customFilterAndSearch: this.customFilterAndSearch,
      render: (renderData) =>
        renderProvenanceNodeCell(renderData, this.handleProvenanceNodeClick),
      groupedSummaryComponent: ({ incomingData }) => {
        console.log("in generate column object");
        return (
          <GroupDataResolver incomingData={incomingData}>
            {({ partitionedData }) => {
              if (partitionedData.length === 0) {
                return <div></div>;
              }
              return (
                <GroupedEventSummary
                  incomingData={partitionedData}></GroupedEventSummary>
              );
            }}
          </GroupDataResolver>
        );
      },

      type: "provenance",
      filterComponent: (props) => (
        <EventsSummary
          incomingData={{ incomingData: this.data }}
          onFilter={(filter, value, row) => {
            return this.handleFilterChange(this.name, filter);
          }}></EventsSummary>
      ),
    };
  }
}

const GroupedEventSummaryFunc = ({ incomingData }) => {
  const filteredList = useMemo(() => {
    return incomingData.map((row) => {
      return {
        participantID: row.participantID,
        // uniqueID: row.uniqueID,
        condition: row.condition,
        taskID: row.taskID,
      };
    });
  });

  const [
    isLoading,
    errorLoading,
    patternDataFromServer,
  ] = useFetchAPIData(async () => {
    const response = await getTopPatternsForGroup(filteredList);
    return response;
  }, []);

  // create list of individuals in each group
  return (
    <div>
      {isLoading && (
        <Skeleton width={"150px"} height={"35px"} variant={"rect"}></Skeleton>
      )}
      {errorLoading && <p>{errorLoading}</p>}
      <div style={{ height: "60px", overflow: "auto" }}>
        <Typography style={{ float: "left", marginTop: "20px" }}>
          {filteredList.length} Participants
        </Typography>
        {patternDataFromServer &&
          patternDataFromServer[0]["topK"].map((topSequence, index) => {
            return (
              <div
                key={`sequence${index}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "whitesmoke",
                  borderRadius: "20px",
                  padding: "4px",
                  margin: "10px",
                }}>
                <div style={{ float: "left" }}>
                  <ProvenanceIsolatedNodes
                    nodes={topSequence.sequence.map((seq) => {
                      return { name: seq };
                    })}
                    handleProvenanceNodeClick={
                      console.log
                    }></ProvenanceIsolatedNodes>
                </div>

                <span style={{ float: "right" }}> {topSequence["count"]}</span>
              </div>
            );
          })}{" "}
      </div>
    </div>
  );
};
const GroupedEventSummary = pure(GroupedEventSummaryFunc);

function renderNotesCell(rowData) {
  if (!Array.isArray(rowData.tags)) {
    rowData.tags = [];
  }
  return (
    <TagWrapper
      id={generateRowId(rowData)}
      tags={rowData.tags}
      onTagChange={(action, tag) => {
        // check if rowData is selected;
        if (action === "Add") {
          rowData.tags.push(tag);
        } else {
          const index = rowData.tags.findIndex((iterTag) => {
            return iterTag.name === tag[0]?.name;
          });
          if (index > -1) {
            rowData.tags.splice(index, 1);
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

function renderProvenanceNodeCell(data, handleProvenanceNodeClick) {
  return (
    <ProvenanceIsolatedNodes
      nodes={data.sequence}
      handleProvenanceNodeClick={
        handleProvenanceNodeClick
      }></ProvenanceIsolatedNodes>
  );
}

const GroupDataResolverFunc = (props) => {
  const { incomingData, children } = props;
  const [partitionedData, setPartitionedData] = useState([]);
  useEffect(() => {
    console.log("in groupdata useEffect!!!");
    if (incomingData && incomingData.length > 0) {
      setPartitionedData(incomingData);
    }
  }, [incomingData.length]);
  if (_.isFunction(children)) {
    return children({ partitionedData });
  }
  return <div></div>;
};

const GroupDataResolver = pure(GroupDataResolverFunc);
