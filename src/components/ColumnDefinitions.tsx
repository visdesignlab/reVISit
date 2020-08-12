import React, { useState, useEffect } from "react";
import { QuantitativeFilter, CategoricalFilter } from "./TableFilters";
import * as d3 from "d3";

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
        fill={"whitesmoke"}
        width={commonScale(rowData[name])}
        height={cellHeight}></rect>
      {additionalComponents}
    </svg>
  );
};

export class CategoricalColumn {
  constructor(data, name, width, order) {
    this.name = name;
    this.data = data;
    this.width = width;
    this.order = order;
  }
  generateColumnObject() {
    return {
      title: this.name,
      name: this.name,
      render: (rowData) => {
        console.log("in render cat", this.name, rowData);

        return <span>{this.name}</span>;
      },
      width: this.width,
    };
  }
}
export class QuantitativeColumn {
  constructor(data, name, width, order) {
    this.name = name;
    this.data = data;
    this.width = width;
    this.order = order;
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
    const quantWidth = 300;
    const max = d3.max(this.data, (datum) => datum[this.name]);
    this.scale = d3.scaleLinear().domain([0, max]).range([0, quantWidth]);
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
