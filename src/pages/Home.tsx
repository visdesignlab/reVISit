import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";

import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import Skeleton from "@material-ui/lab/Skeleton";

import Fab from "@material-ui/core/Fab";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Tagger from "../components/Tagger";

import SortIcon from "@material-ui/icons/Sort";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import { useFetchAPIData } from "../hooks/hooks";

// import * as PouchDB from 'pouchdb-browser';

import * as d3 from "d3";

import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceIsolatedNodes from "../components/ProvenanceIsolatedNodes";

import Grid, { GridSpacing } from "@material-ui/core/Grid";
import { pathToFileURL } from "url";
import { keys } from "mobx";
import { Sort } from "@material-ui/icons";

let rowHeight = 300;
let figureWidth = 572;

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: 10,
      },
    },
  },
});

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    flexGrow: 1,
  },
  table: {
    padding: "10px",
  },
  sortable: {
    cursor: "pointer",
    backgroundColor: "rgb(240,240,240)",
  },
  sorted: {
    fill: "#5d83d2",
  },
  media: {
    width: figureWidth,
    height: rowHeight,
    // border: '1px solid lightgray'
  },
  condition: {
    fontSize: "1em",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function scale(width, maxValue) {
  return d3.scaleLinear().range([10, width]).domain([0, maxValue]);
}

const accScale = scale(40, 1);
const timeScale = scale(40, 3.59);

export const BarChart = (props) => {
  const {
    allData,
    hoveredRow,
    hoveredRowColor,
    metric,
    vert = false,
    size = { width: 150, height: 200 },
  } = props;

  let data = allData.find((m) => m.metric == metric);
  if (data.type == "text" || data.type == "longtext") {
    let width = vert ? size.width : 900;
    let height = vert ? size.height : 80;

    let maxBarHeight = vert ? 20 : height - 10;

    let varsToPlot = Object.entries(data.count)
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .slice(0, 20);

    //compute scale for data;
    let yDomain = varsToPlot.map((v) => v[0]);
    let xDomain = d3.extent(varsToPlot.map((v) => v[1]));

    let xScale = d3.scaleLinear().domain(xDomain).range([0, maxBarHeight]);

    let yScale = d3
      .scaleBand()
      .domain(yDomain)
      .range([0, height])
      .padding(0.65);

    let barWidth = yScale.bandwidth();

    let hoveredStats = hoveredRow
      ? hoveredRow.stats.find((m) => m.metric == metric)
      : undefined;
    let hoveredVarsToPlot = hoveredStats
      ? Object.entries(hoveredStats.count)
          .sort((a, b) => (a[1] > b[1] ? -1 : 1))
          .slice(0, 20)
      : [];

    if (!vert) {
      xDomain = varsToPlot.map((v) => v[0]);
      yDomain = [0, d3.extent(varsToPlot.map((v) => v[1]))[1]];

      yScale = d3.scaleLinear().domain(yDomain).range([15, maxBarHeight]);

      xScale = d3.scaleBand().domain(xDomain).range([0, width]).padding(0.5);

      barWidth = xScale.bandwidth();
    }

    let nothingToPlot = varsToPlot.length < 1;
    let transform = vert ? "translate(100px,0px)" : "translate(10px,20px)";
    {
      return nothingToPlot ? null : (
        <svg width={width + 10} height={height + 20}>
          {/* add axis */}
          <g style={{ transform: transform }}>
            <line
              x1={0}
              y1={vert ? yScale.range()[0] : yScale.range()[1]}
              x2={vert ? 0 : xScale.range()[1]}
              y2={yScale.range()[1]}
              style={{ stroke: "rgb(0,0,0,0.25)", strokeWidth: 1 }}></line>
            {varsToPlot.map((entry) => {
              let key = entry[0];
              let value = entry[1];
              let tooltipText = key + " : " + value;

              let x = vert ? xScale(value) + 5 : xScale(key) - 3;
              let y = vert
                ? yScale(key) - barWidth
                : height - yScale.range()[0];
              return (
                <React.Fragment key={key}>
                  <Tooltip title={tooltipText}>
                    <rect
                      className="count"
                      key={"d_" + key}
                      style={{
                        opacity: hoveredRowColor ? 0.5 : 1,
                        fill: "rgb(93, 131, 210)",
                      }}
                      x={vert ? 0 : xScale(key)}
                      y={
                        vert
                          ? yScale(key)
                          : height - yScale.range()[0] - yScale(value)
                      }
                      width={vert ? xScale(value) : barWidth}
                      height={vert ? barWidth : yScale(value)}></rect>
                  </Tooltip>
                  <Tooltip title={tooltipText}>
                    <text
                      style={{
                        fontSize: "1em",
                        textAnchor: "start",
                        transform:
                          "translate(" + x + "px," + y + "px) rotate(270deg)",
                      }}
                      x={0}
                      y={0}>
                      {" "}
                      {key}{" "}
                    </text>
                  </Tooltip>
                  {hoveredRowColor ? (
                    ""
                  ) : (
                    <text
                      style={{
                        fontSize: "1em",
                        textAnchor: "middle",
                      }}
                      x={vert ? -5 : xScale(key) + barWidth / 2}
                      y={
                        vert
                          ? yScale(key) - barWidth
                          : height - yScale.range()[0] - yScale(value) - 2
                      }>
                      {" "}
                      {value}{" "}
                    </text>
                  )}
                </React.Fragment>
              );
            })}

            {/* //Only plot hoveredVars that are in the original top 20 to keep the distribution of bars the same */}
            {hoveredVarsToPlot
              .filter((d) => xScale(d[0]))
              .map((entry) => {
                let key = entry[0];
                let value = entry[1];
                let tooltipText = key + " : " + value;

                let x = vert ? xScale(value) + 5 : xScale(key) - 3;
                let y = vert
                  ? yScale(key) - barWidth
                  : height - yScale.range()[0];
                return (
                  <React.Fragment key={"hovered" + key}>
                    <Tooltip title={tooltipText}>
                      <rect
                        className="count"
                        key={"d_" + key}
                        style={{ fill: hoveredRowColor }}
                        x={vert ? 0 : xScale(key)}
                        y={
                          vert
                            ? yScale(key)
                            : height - yScale.range()[0] - yScale(value)
                        }
                        width={vert ? xScale(value) : barWidth}
                        height={vert ? barWidth : yScale(value)}></rect>
                    </Tooltip>

                    <text
                      style={{
                        fontSize: "1em",
                        textAnchor: "middle",
                      }}
                      x={vert ? -5 : xScale(key) + barWidth / 2}
                      y={
                        vert
                          ? yScale(key) - barWidth
                          : height - yScale.range()[0] - yScale(value) - 2
                      }>
                      {" "}
                      {value}{" "}
                    </text>
                  </React.Fragment>
                );
              })}
          </g>
        </svg>
      );
    }
  }

  return null;
};

{
  /* <>{[0, 1, 2,3,4].map(i => {
                                  let frequentActions = freqPattern[i].seq.map(a => ({ event: a, id: a, count: freqPattern[i].count, scale: colorScale(freqPattern[i].count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
                                  return <>
                                    <Box style={{ display: 'block' }} >
                                      <Box  mb={"6px"} style={{ display: 'inline-block', width: 100 }}>
                                        <svg width={100} height={34}>
                                        <rect x={100-countScale(freqPattern[i].count)} y={0} width={countScale(freqPattern[i].count)} height={30} style={{fill: 'rgb(147 195 209)', 'stroke':'white', strokeWidth:'8px' }}></rect>
                                        <text x={90} y={20} style={{'fontWeight':'bold','textAnchor':'end'}}>{freqPattern[i].count}</text>
                                        </svg>
                                      </Box>
                                      <Box mt={"5px"} mb={"6px"} style={{ display: 'inline-block', width: 300 }}>
                                        <ProvenanceIsolatedNodes
                                          key={task.taskID}
                                          nodes={
                                            frequentActions
                                          }></ProvenanceIsolatedNodes>
                                      </Box>
                                    </Box>
                                  </>
                                }
                                )}
                                </> */
}
let countScale = d3.scaleLinear().range([0, 75]).domain([0, 137]);

function Stimulus({ taskID, conditionName, classes }) {
  // console.log('am rerendering')

  //check if image exists
  let imgName = "../static/taskImages/" + taskID + "_" + conditionName + ".png";

  // image={require("../static/taskImages/" +
  // taskID +
  // "_" +
  // conditionName +
  // ".png")}

  let img;
  try {
    img = require("../static/taskImages/" +
      taskID +
      "_" +
      conditionName +
      ".png");
  } catch (err) {
    // console.log("could not find", imgName);
    img = "";
  }

  return (
    <>
      <Box mt={"5px"} mb={"6px"} mr={"10px"} boxShadow={1}>
        <CardMedia
          style={{ display: "inline-block" }}
          className={classes.media}
          component="img"
          image={img}
          // image="https://placekitten.com/g/100/100"
          title={imgName}
        />
      </Box>
      <Typography className={classes.pos} variant="overline" color="primary">
        Stimulus
      </Typography>
    </>
  );
}

//Compoment to draw participant counts for each interaction sequence
function SequenceCount({ row, hoveredRow, hoveredRowColor, clickedRow, clickedRowColor }) {
  let total = 137;
  let height = 25;
  let iconWidth = 3;
  let padding = 1;
  let numIconsPerCol = Math.floor(height / (iconWidth + padding));
  let numCols = Math.ceil(total / numIconsPerCol);
  let width = numCols * (iconWidth + padding);

  let textWidth = 25;

  let xScale = d3
    .scaleLinear()
    .range([0, iconWidth + padding])
    .domain([0, 1]);
  let yScale = d3.scaleLinear().range([0, height]).domain([0, numIconsPerCol]);

  let currentParticipants = row.matchingSequences.map((s) => s.participantID);
  let hoveredParticipants =[]; 
  
  if (clickedRow){
    hoveredParticipants  = clickedRow.matchingSequences.map((s) => s.participantID)
  } else {
    hoveredParticipants = hoveredRow
    ? hoveredRow.matchingSequences.map((s) => s.participantID)
    : [];
  } 

  // if (hoveredRow){
  //   console.log('currentRow has ', row.count, currentParticipants.length , 'participants')
  //   console.log('hoveredRow has ', hoveredParticipants.length , 'participants')
  
  // }
 

  let intersection = currentParticipants.filter((x) =>
    hoveredParticipants.includes(x)
  );

  // width = countScale.range()[1]

  return (
    <svg width={width + textWidth*4} height={height}>
      {Array.from(Array(total).keys()).map((key) => {
        return (
          <rect
            key={key}
            x={xScale(Math.floor(key / numIconsPerCol))}
            y={yScale(key % numIconsPerCol) + padding}
            width={iconWidth}
            height={iconWidth}
            style={{
              // opacity: key < intersection.length ? 1 : .2,
              fill:
                key < intersection.length
                  ? hoveredRowColor || "rgb(220, 220, 220)"
                  : key < row.count
                  ? (hoveredRow && clickedRow ? clickedRowColor : "rgb(150, 150, 150)")
                  : "rgb(220, 220, 220)", //rgb(147 195 209)
            }}></rect>
        );
      })}

      <text
        x={xScale(numCols) + padding}
        y={yScale(numIconsPerCol / 2)}
        style={{
          fontWeight: "bold",
          alignmentBaseline: "middle",
          textAnchor: "start",
          fill:  "rgb(150, 150, 150)",
        }}>
        {row.count}
      </text>

      {hoveredRow ? <text
        x={xScale(numCols) + padding + 25}
        y={yScale(numIconsPerCol / 2)}
        style={{
          fontWeight: "bold",
          alignmentBaseline: "middle",
          textAnchor: "start",
          fill: hoveredRowColor,
        }}>
        {' / ' + intersection.length }
      </text> : <></>}

      {clickedRow && hoveredRow? <text
        x={xScale(numCols) + padding + 55}
        y={yScale(numIconsPerCol / 2)}
        style={{
          fontWeight: "bold",
          alignmentBaseline: "middle",
          textAnchor: "start",
          fill: clickedRowColor,
        }}>
        {'/ ' + (row.count - intersection.length) }
      </text> : <></>}



      {/* <rect
    x={0}
    y={0}
    width={countScale(137)}
    height={20}
    style={{
      fill: "rgb(220, 220, 220)"
    }}></rect>
<rect
    x={0}
    y={0}
    width={countScale(row.count)}
    height={20}
    style={{
      fill: "rgb(93, 131, 210)"
    }}></rect>
<text
    x={countScale(137)+padding}
    y={10}
    style={{ fontWeight: "bold", alignmentBaseline:'middle', textAnchor: "start" ,'fill':'rgb(93, 131, 210)' }}>
    {row.count}
  </text> */}
    </svg>
  );
}

function SortIconContainer({ sorted, classes }) {
  let size = 20;
  return (
    <svg width={size} height={size} style={{ paddingTop: "5px" }}>
      <SortIcon
        className={sorted ? classes.sorted : ""}
        style={{ transform: "rotate(-180deg)" }}
        width={size}
        height={size}
      />
    </svg>
  );
}

//Compoment to draw interaction sequence tables
function TableComponent({
  rows,
  hoveredRowColor,
  hoveredRow = undefined,
  setHoveredRow = undefined,
  clickedRowColor,
  clickedRow = undefined,
  setClickedRow = undefined
}) {
  // console.log('rendering table',hoveredRow)
  // console.log(rows)

  const classes = useStyles();

  let [sort, setSort] = useState({
    value: "Count",
    desc: { Count: true, Pattern: true },
  });

  // useEffect()({
  rows.sort((a, b) => {
    let aValue = sort.value == "Count" ? a.count : a.seq.length;
    let bValue = sort.value == "Count" ? b.count : b.seq.length;
    let rValue = sort.desc[sort.value] ? -1 : 1;
    return aValue > bValue ? rValue : -rValue;
  });
  // },[])

  // console.log(rows)
  return (
    <MuiThemeProvider theme={theme}>
      <TableContainer style={{ maxHeight: "300px" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {[
                { key: "Pattern", title: "Interaction Pattern" },
                { key: "Count", title: "Participant Count" },
              ].map((header) => {
                return (
                  <TableCell
                    key={header["key"]}
                    onClick={() => {
                      sort = { ...sort };
                      let sameKey = sort.value == header.key;
                      sort.value = header.key;
                      sort.desc[header.key] = sameKey
                        ? !sort.desc[header.key]
                        : true;
                      setSort(sort);
                    }}
                    className={classes.sortable}>
                    {" "}
                    {header.title}
                    <SortIconContainer
                      classes={classes}
                      sorted={sort.value == header.key}></SortIconContainer>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              // console.log('row',row)
              return (
                <TableRow
                  key={row.id}
                  onMouseDown={() => {
                    clickedRow == row ? setClickedRow() : setClickedRow(row);
                  }}
                  onMouseEnter={() => {
                    setHoveredRow(row);
                  }}
                  onMouseLeave={() => setHoveredRow()}
                  style={{
                    background: clickedRow == row ?  "rgb(230,230,230)" : hoveredRow == row ? "rgb(245,245,245)"  : "white",
                  }}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "300px", padding: "10px" }}>
                    {row.seq ? (
                      <ProvenanceIsolatedNodes
                        // key={}
                        nodes={row.seqObj}
                        selectedItemId={undefined}
                        handleProvenanceNodeClick={() => {}}></ProvenanceIsolatedNodes>
                    ) : (
                      row.answer
                    )}
                  </TableCell>
                  {row.seq ? (
                    <TableCell align="left">
                      <SequenceCount
                        row={row}
                        hoveredRow={hoveredRow}
                        hoveredRowColor={hoveredRowColor}
                        clickedRow = {clickedRow}
                        clickedRowColor = {clickedRowColor}
                        ></SequenceCount>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  {/* <TableCell  component="th" scope="row" style={{padding:'10px'}}>
          {row.seq? <Histogram data={value} ci={value.ci} />: <></>}
        </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MuiThemeProvider>
  );
}

// Compoment for single metric histogram
function Histogram({ data, hoveredRow, metric, hoveredRowColor, clickedRow, clickedRowColor }) {
  // let hoveredStats = undefined;
  // let hoveredCI = undefined;
  let value = data.find((m) => m.metric == metric);
  if (value.type == "int" || value.type == "float") {
    let hoveredStats; 
    
    if (clickedRow && hoveredRow && clickedRow == hoveredRow){
      hoveredStats = hoveredRow
      ? hoveredRow.stats.find((m) => m.metric == metric)
      : undefined;
      console.log('showing metrics for ', hoveredRow.matchingSequences.length)

    }
    else if (clickedRow){
      
      let intersectionRow = hoveredRow ? clickedRow.intersections.find(r=>r.id == hoveredRow.id) : undefined
      hoveredStats = intersectionRow 
      ? intersectionRow.stats.find((m) => m.metric == metric)
      : undefined;
      if (intersectionRow) {
        console.log('showing metrics for ', intersectionRow.matchingSequences.length)
      }
    } else {
      hoveredStats = hoveredRow
      ? hoveredRow.stats.find((m) => m.metric == metric)
      : undefined;
    }
     

    
    let hoveredCI = hoveredStats ? hoveredStats.ci : undefined;
    let histColor = clickedRow && clickedRow !== hoveredRow ? clickedRowColor  : hoveredRowColor
    return (
      <Grid key={metric + "_hist"} item>
        {
          <DrawHistogram
            hoveredRowColor={histColor}
            data={hoveredStats || value}
            ci={hoveredCI || value.ci}
          />
        }
        <Typography
          style={{ display: "block" }}
          color="primary"
          variant="overline">
          {metric}
        </Typography>
      </Grid>
    );
  }
  // if (value.type == "text") {
  //   return (
  //     <Grid key={metric+'_bar'} item>
  //       <BarChart data={value}></BarChart>
  //       <Typography
  //         style={{ display: "block" }}
  //         color="primary"
  //         variant="overline">
  //         {metric}
  //       </Typography>
  //     </Grid>
  //   );
  // }
  return <></>;
}

export const DrawHistogram = (props) => {
  const {
    data,
    hoveredRowColor,
    ci,
    size = { width: 100, height: 40 },
  } = props;

  let [hovered, setHovered] = useState(false);

  let menu = function () {
    return (
      <>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          fill={"white"}
          opacity={0.5}></rect>

        <g transform={`translate(0,0)`}>
          {<SortIcon width={16} height={16} />}
          <text x={20} y={10}>
            Sort
          </text>
        </g>
      </>
    );
  };

  let average = ci[0];
  let lowerBound = ci[1];
  let upperBound = ci[2];

  let width = size.width;
  let height = size.height;

  let barHeight = 20;
  let barPadding = 2;
  //compute scale for data;
  let xDomain = d3.extent(data.bins);
  let yDomain = d3.extent(data.hist);

  let xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([10, width - 40]);

  let yScale = d3.scaleLinear().domain(yDomain).range([0, barHeight]);

  let barWidth = xScale(data.bins[1]) - xScale(data.bins[0]) - barPadding;

  let textLabel = Math.round(average * 10) / 10; //label == '%' ? (Math.round(average * 100) + ' ' + label) : Math.round(average * 10) / 10 + ' ' + label

  return (
    <>
      <svg
        style={{ transform: "translate(-10px,0px)" }}
        width={width}
        height={height}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <g transform={"translate(10,0)"}>
          <line
            x1={0}
            y1={yScale.range()[1]}
            x2={xScale.range()[1]}
            y2={yScale.range()[1]}
            style={{ stroke: "rgb(0,0,0,0.25)", strokeWidth: 1 }}></line>
          {data.hist.map((d, i) => (
            <rect
              className="count"
              key={"d_" + data.bins[i]}
              style={{ fill: hoveredRowColor || "rgb(149 149 149)" }} //rgb(93, 131, 210)
              x={xScale(data.bins[i]) + barPadding / 2}
              y={barHeight - yScale(d)}
              width={barWidth}
              height={yScale(d)}></rect>
          ))}
          <circle
            className="count"
            style={{ fill: "#ff5e00", opacity: 1 }}
            cx={xScale(average)}
            cy={yScale.range()[1] / 2}
            r={5}></circle>

          <line
            className="count"
            style={{ stroke: "black", strokeWidth: 2, opacity: 0.5 }}
            x1={xScale(lowerBound)}
            x2={xScale(upperBound)}
            y1={yScale.range()[1] / 2}
            y2={yScale.range()[1] / 2}></line>

          <text
            style={{ fontSize: "1em", textAnchor: "middle" }}
            x={xScale(average)}
            y={40}>
            {" "}
            {textLabel}{" "}
          </text>

          {hovered ? (
            <>
              <text
                style={{
                  fill: "rgb(0,0,0,0.25)",
                  fontSize: "1em",
                  textAnchor: "end",
                }}
                x={-2}
                y={23}>
                {" "}
                {Math.floor(xScale.domain()[0])}{" "}
              </text>
              <text
                style={{
                  fill: "rgb(0,0,0,0.25)",
                  fontSize: "1em",
                  textAnchor: "start",
                }}
                x={xScale.range()[1] + 2}
                y={23}>
                {" "}
                {Math.ceil(xScale.domain()[1])}{" "}
              </text>
            </>
          ) : null}
        </g>
      </svg>
    </>
  );
};

//Compoment for the card for a single Condition
function ConditionCard({ condition, conditionName, classes, taskID }) {
  //Keeps track of which rows in the table are hovered on
  const [hoveredRow, setHoveredRow] = useState();
  const [clickedRow, setClickedRow] = useState();
  let [hidden, setHidden] = useState(false);

  let hoveredRowColor = "#f59c3d"; // '#9100e6';
  let clickedRowColor = "#3d77f5"; // '#9100e6';
  let freqPattern, data, metricValues;

  //only compute when the condition changes
  // useEffect(() => {
  // console.log('calling use effect')
  freqPattern = condition.patterns[0].topK;
  data = condition.stats;

  metricValues = [...new Set(data.map((m) => m.metric))];

  freqPattern.map((action, i) => {
    action.id = i;
    action.seqObj = action.seq.map((a) => ({
      name: a,
      id: a,
      count: action.count,
    }));
    return action;
  });

  // }, [condition]);
  // console.log(condition.textAnswers.map(a=>a.answer).flat())
  // console.log(metricValues)
  return !metricValues ? (
    <></>
  ) : (
    <React.Fragment key={"ConditionCard_" + conditionName}>
      <Typography
        onClick={() => {
          setHidden(!hidden);
        }}
        style={{ cursor: "pointer" }}
        className={classes.condition}
        variant="overline">
        {conditionName}
      </Typography>
      {hidden ? (
        <></>
      ) : (
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="flex-start" spacing={2}>
              <Grid key={"cat"} item>
                <Stimulus
                  taskID={taskID}
                  classes={classes}
                  conditionName={conditionName}></Stimulus>
              </Grid>
              <Grid key={"prov"} item>
                <Box
                  height={rowHeight}
                  width={600}
                  mt={"5px"}
                  mb={"6px"}
                  mr={"10px"}
                  boxShadow={0}
                  style={{ overflow: "scroll" }}>
                  {
                    <TableComponent
                      rows={freqPattern}
                      hoveredRow={hoveredRow}
                      hoveredRowColor={hoveredRow ? hoveredRowColor : undefined}
                      setHoveredRow={setHoveredRow}
                      clickedRow={clickedRow}
                      clickedRowColor={clickedRow ? clickedRowColor : undefined}
                      setClickedRow={setClickedRow}></TableComponent>
                  }
                </Box>
                <Typography
                  className={classes.pos}
                  variant="overline"
                  color="primary">
                  Actions
                </Typography>
              </Grid>
              <Grid key={"performanceMetrics"} item xs>
                <Grid
                  key={"performanceMetrics"}
                  item
                  style={{ display: "block" }}>
                  <Box
                    height={rowHeight / 2.5}
                    p={"20px"}
                    mt={"5px"}
                    mb={"6px"}
                    mr={"10px"}
                    style={{ overflow: "scroll", display: "inline-flex" }}
                    boxShadow={1}>
                    {metricValues.map((metric) => {
                      return (
                        <Histogram
                          key={metric}
                          data={data}
                          hoveredRow={hoveredRow}
                          hoveredRowColor={
                            hoveredRow ? hoveredRowColor : undefined
                          }
                          clickedRow={clickedRow}
                          clickedRowColor={
                            clickedRow ? clickedRowColor : undefined
                          }
                          metric={metric}></Histogram>
                      );
                    })}
                  </Box>
                  <Typography
                    className={classes.pos}
                    variant="overline"
                    color="primary"
                    style={{ display: "block" }}>
                    Performance Metrics
                  </Typography>
                </Grid>

                <Grid key={"qualData"} item xs>
                  <Box
                    height={rowHeight / 2.5}
                    width={1}
                    mt={"5px"}
                    mb={"6px"}
                    mr={"10px"}
                    boxShadow={1}
                    style={{ overflow: "scroll" }}>
                    {metricValues.map((metric) => {
                      return (
                        <BarChart
                          key={metric}
                          allData={data}
                          hoveredRow={hoveredRow}
                          hoveredRowColor={
                            hoveredRow ? hoveredRowColor : undefined
                          }
                          metric={metric}></BarChart>
                      );
                    })}
                    {/* {<Tagger text = {condition.textAnswers.map(a=>a.answer).flat().join('--')}></Tagger>} */}
                    {/* <TableComponent rows={condition.textAnswers}></TableComponent> */}
                  </Box>
                  <Typography
                    className={classes.pos}
                    variant="overline"
                    color="primary">
                    Word Counts for Qualitative Responses
                  </Typography>
                </Grid>
              </Grid>

              {/* {condition.textAnswers.map(txt=>{
              return <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={txt.answer}
                  secondary={null}
                />
              </ListItem>
          </List>
            })} */}
            </Grid>
          </Grid>
        </Grid>
      )}
      <Divider />
    </React.Fragment>
  );
}

function TaskCard({ task, classes }) {
  let [hidden, setHidden] = useState(false);

  return (
    <Box
      m={2}
      key={"box_" + task.taskID}
      // style={{ display: "inline-block" }}
    >
      {/* style={{ 'width': 600 }}  */}
      <Card className={classes.root} key={task.taskID}>
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            onClick={() => {
              setHidden(!hidden);
            }}
            style={{ cursor: "pointer", display: "inline-block" }}>
            {task.name}
          </Typography>
          {/* <Tooltip title={taskTooltip}> */}
          <Typography
            className={classes.pos}
            color="textSecondary"
            style={{ display: "inline-block", marginLeft: "10px" }}>
            {task.prompt + "  [" + task.answer + "]"}
          </Typography>
          <Divider />

          {hidden ? (
            <></>
          ) : (
            Object.keys(task.conditions).map((cKey) => {
              let condition = task.conditions[cKey];
              return (
                <ConditionCard
                  key={task.taskID + cKey}
                  condition={condition}
                  conditionName={cKey}
                  taskID={task.taskID}
                  classes={classes}></ConditionCard>
              );
            })
          )}
        </CardContent>
        {hidden ? (
          <></>
        ) : (
          <CardActions>
            <Button size="small">Explore</Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
}

export default function TaskContainer() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const { data, homeTaskSort } = useContext(ProvenanceDataContext);


  // console.log('data is ', data)

  // console.log('homeTaskSort is ', homeTaskSort)

  function getValues(task, conditionFilter, sortKey) {
    let conditions = Object.keys(task.conditions);
    let values = [];
    conditions.map((c) => {
      if (conditionFilter[c]) {
        let metricValues = task.conditions[c].stats.find(
          (s) => s.metric == sortKey
        );
        values.push(metricValues.ci[1]); //average for that metric
      }
    });
    return values;
  }
  if (data) {
    // console.log(data.tasks)

    if (homeTaskSort) {
      console.log("homeTaskSort", homeTaskSort);
      let sortKey = homeTaskSort.metric;
      let desc = homeTaskSort.desc;
      let conditionFilter = homeTaskSort.conditions;

      data.tasks.sort((a, b) => {
        let aValue, bValue;
        if (sortKey == "name") {
          aValue = a[sortKey];
          bValue = b[sortKey];
        } else {
          let aValues = getValues(a, conditionFilter, sortKey);
          let bValues = getValues(b, conditionFilter, sortKey);
          aValue = desc ? Math.max(...aValues) : Math.min(...aValues);
          bValue = desc ? Math.max(...bValues) : Math.min(...bValues);
        }

        let rValue = desc ? -1 : 1;
        return aValue > bValue ? rValue : -rValue;
      });

      data.taskList.sort((a, b) => {
        let taskA = data.tasks.find((t) => t.taskID == a);
        let taskB = data.tasks.find((t) => t.taskID == b);

        if (!taskA || !taskB) {
          return -1;
        }
        let indexA = data.tasks.indexOf(taskA);
        let indexB = data.tasks.indexOf(taskB);

        return indexA > indexB ? 1 : -1;
      });

      console.log("done sorting");
    }
  }

  // })
  let colorScale = d3
    .scaleLinear()
    // .domain(d3.extent(allCounts))
    .domain([0, 800])
    .range([0.3, 1]);

  //Only render when all API calls have returned
  let ready = data;
  // console.log('actions', actions)
  return ready == undefined ? (
    <></>
  ) : (
    <>
      {data.taskList.map((taskID) => {
        let task = data.tasks.find((t) => t.taskID == taskID);
        return task ? (
          <TaskCard key={task.name} task={task} classes={classes}></TaskCard>
        ) : (
          <Skeleton
            key={taskID}
            variant="rect"
            width={"98%"}
            height={500}
            style={{ margin: "20px", padding: "20px" }}>
            Loading {taskID}
          </Skeleton>
        );
      })}
    </>
  );
}
