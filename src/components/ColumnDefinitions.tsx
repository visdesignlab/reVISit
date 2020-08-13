import React, { useState, useEffect } from "react";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
import * as d3 from "d3";
import eventMapping from "./eventMapping";
import TagWrapper from "./reactTagWrapper";
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";

const columnOverrides = {};
const filterQuantitativeValues = (filter, value, row) =>
  filter.filterMin && value <= filter.filterMax;

const QuantitativeCell = ({ rowData, name, commonScale }) => {
  let additionalComponents;
  const cellHeight = 20;
  if (name === "time" && rowData?.sequence) {
    // map through requences
    additionalComponents = rowData.sequence.map((node) => {
      console.log("sequence node", node);
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
            tags={rowData.tags}
            onTagChange={(action, tag) => {
              // check if rowData is selected;
              if (action === "Add") {
                rowData.tags.push(tag);
                this.handleTagCreation(
                  rowData.participantID,
                  rowData.taskID,
                  tag,
                  "Add"
                );
              } else {
                const index = rowData.tags.findIndex((iterTag) => {
                  return iterTag.name === tag[0]?.name;
                });
                if (index > -1) {
                  rowData.tags.splice(index, 1);
                }
                this.handleTagCreation(
                  rowData.participantID,
                  rowData.taskID,
                  tag,
                  "Delete"
                );
              }
            }}></TagWrapper>
        );
      },
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
  constructor(data, name, metaData) {
    this.name = name;
    this.data = data;
    this.width = metaData.width ? metaData.width : 100;
    this.order = metaData.order;
    this.hideByDefault = metaData.hideByDefault;
    this.customSort = (a, b) => a[this.name] - b[this.name];
    this.customFilterAndSearch = (filter, value, row) => {
      return filterQuantitativeValues(filter, value, row);
    };
    this.cellComponent = (rowData) => {
      return (
        <QuantitativeCell
          rowData={rowData}
          name={this.name}
          commonScale={this.scale}></QuantitativeCell>
      );
    };
    const max = d3.max(this.data, (datum) => datum[this.name]);
    this.scale = d3.scaleLinear().domain([0, max]).range([0, this.width]);
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
      customSort: this.customSort,
      render: this.cellComponent,
      order: this.order,
      hideByDefault: this.hideByDefault,
      customFilterAndSearch: this.customFilterAndSearch,
      groupedSummaryComponent: ({ incomingData }) => {
        console.log("dywootto", incomingData);
        return (
          <GroupDataResolver incomingData={incomingData}>
            {({ partitionedData }) => {
              if (partitionedData.length === 0) {
                return <div></div>;
              }
              console.log("groupedSumm", this.scale);
              return (
                <QuantitativeFilter
                  xScale={this.scale}
                  data={partitionedData.map(
                    (datum) => datum[this.name]
                  )}></QuantitativeFilter>
              );
            }}
          </GroupDataResolver>
        );
      },
      filterComponent: (props) => {
        console.log("groupedSumm", this.scale, this.data);
        return (
          <QuantitativeFilter
            {...props}
            xScale={this.scale}
            onFilter={(val) => console.log(val)}
            data={this.data.map(
              (datum) => datum[this.name]
            )}></QuantitativeFilter>
        );
      },
    };
  }
}
export class ProvenanceColumn {
  constructor(metaData) {
    this.width = 300;
    this.handleProvenanceNodeClick = metaData.handleProvenanceNodeClick;
  }
  generateColumnObject() {
    return {
      title: "Events Used",
      name: "provenance",
      width: this.width,
      customSort: (a, b) => a.sequence.length - b.sequence.length,
      render: (renderData) =>
        renderProvenanceNodeCell(renderData, this.handleProvenanceNodeClick),
      groupedSummaryComponent: ({ incomingData }) => {
        console.log("dywootto", incomingData);
        return <div></div>;
      },
      filterComponent: (props) => <div></div>,
    };
  }
}

function renderNotesCell(rowData) {
  if (!Array.isArray(rowData.tags)) {
    rowData.tags = [];
  }
  return (
    <TagWrapper
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
