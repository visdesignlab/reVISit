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

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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

function rectangle(d, scale, label) {
  return (
    <svg width={130} height={25} key={d.key}>
      <rect
        className="count"
        style={{ fill: "grey", opacity: 0.5 }}
        x={0}
        width={scale(d)}
        height={25}></rect>
      <text style={{ fontSize: "1.5em" }} x={scale(d)} y={0}>
        {" "}
        {d + " " + label}{" "}
      </text>
    </svg>
  );
}

function scatter(data, metric, scale, label) {
  let average = data.average[metric];
  return (
    <svg width={100} height={40}>
      {data.values.map((d) => (
        <circle
          className="count"
          style={{ fill: "rgb(93, 131, 210)", opacity: 0.1 }}
          cx={scale(d.answer.accuracy)}
          cy={10}
          r={5}></circle>
      ))}
      <rect
        className="count"
        style={{ fill: "#ff5e00", opacity: 1 }}
        x={scale(average)}
        width={3}
        height={25}></rect>
      <text
        style={{ fontSize: "1em", textAnchor: "start" }}
        x={scale(average)}
        y={40}>
        {" "}
        {Math.round(average * 100)}{" "}
      </text>
      )
      {/* <text style={{ fontSize: '1.5em', 'text-anchor': 'start' }} x={scale(1.4)} y={20}> {data.average.accuracy + ' ' + label} </text> */}
    </svg>
  );
}

export const Histogram = (props) => {
  const { data, ci, size = { width: 150, height: 40 }, onHandleBrush } = props;

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
  let histogramBars = data.hist.map((d, i) => (
    <rect
      className="count"
      key={"d_" + data.bins[i]}
      style={{ fill: "rgb(93, 131, 210)" }}
      x={xScale(data.bins[i]) + barPadding / 2}
      y={barHeight - yScale(d)}
      width={barWidth}
      height={yScale(d)}></rect>
  ));

  function setFilterBounds(inputs) {
    console.log("outputs", inputs);
    if (inputs?.length !== 2) {
      inputs = xScale.range();
    }
    // scale inversion
    const min = xScale.invert(inputs[0]);
    // set bounds
    const max = xScale.invert(inputs[1]);
    // pass max and min to on histogrma brush
    onHandleBrush(min, max);
  }

  // if filtering enabled, wrap bars in a separate brush component
  if (onHandleBrush) {
    histogramBars = (
      <Brush
        width={width}
        height={barHeight}
        scale={xScale}
        onChange={setFilterBounds}>
        {histogramBars}
      </Brush>
    );
  }

  return (
    <svg width={width} height={height}>
      {/* add axis */}
      <line
        x1={0}
        y1={yScale.range()[1]}
        x2={xScale.range()[1]}
        y2={yScale.range()[1]}
        style={{ stroke: "rgb(0,0,0,0.25)", strokeWidth: 1 }}></line>
      {histogramBars}
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
        x2={xScale(average)}
        y1={yScale.range()[1] / 2}
        y2={yScale.range()[1] / 2}></line>

      <line
        className="count"
        style={{ stroke: "black", strokeWidth: 2, opacity: 0.5 }}
        x1={xScale(average)}
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
    </svg>
  );
};

const Brush = (props) => {
  const { width, scale, height, onChange } = props;
  const brushRef = useRef(null);

  useEffect(() => {
    const node = brushRef.current;

    const dayBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("end", brushed);

    d3.select(node)
      .selectAll("g.brush")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "brush");

    d3.select(node).select("g.brush").call(dayBrush);

    function brushed() {
      onChange(d3.event.selection);
    }
  });
  return (
    <g ref={brushRef} height={height} width={width}>
      {props.children}
    </g>
  );
};

export const BarChart = (props) => {
  const { data, size = { width: 130, height: 40 } } = props;
  let barHeight = 20;
  let width = size.width;
  let height = size.height;

  //compute scale for data;
  let xDomain = Object.keys(data.count);
  let yDomain = d3.extent(Object.values(data.count));

  let xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([0, width - 40])
    .padding(0.4);

  let yScale = d3.scaleLinear().domain(yDomain).range([0, barHeight]);

  let barWidth = xScale.bandwidth();
  return (
    <svg width={width} height={height}>
      {/* add axis */}
      <line
        x1={0}
        y1={yScale.range()[1]}
        x2={xScale.range()[1]}
        y2={yScale.range()[1]}
        style={{ stroke: "rgb(0,0,0,0.25)", strokeWidth: 1 }}></line>
      {Object.keys(data.count).map((key, i) => {
        let tooltipText = key + " : " + data.count[key];
        return (
          <>
            <Tooltip title={tooltipText}>
              <rect
                className="count"
                key={"d_" + key}
                style={{ fill: "rgb(93, 131, 210)" }}
                x={xScale(key)}
                y={barHeight - yScale(data.count[key])}
                width={barWidth}
                height={yScale(data.count[key])}></rect>
            </Tooltip>
            <Tooltip title={tooltipText}>
              <text
                style={{
                  transform:
                    "translate(" +
                    xScale(key) +
                    "px, " +
                    (barHeight + 5) +
                    "px) rotate(90deg)",
                  fontSize: "1em",
                  textAnchor: "start",
                }}
                x={0}
                y={0}>
                {" "}
                {key}{" "}
              </text>
            </Tooltip>
          </>
        );
      })}
    </svg>
  );
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
let countScale = d3.scaleLinear().range([0, 100]).domain([0, 300]);

function TableComponent({ rows, hoveredRow, setHoveredRow }) {
  console.log("rows", rows);

  // console.log(rows)
  return (
    <MuiThemeProvider theme={theme}>
      <TableContainer>
        <Table aria-label="simple table">
          {/* <TableHead>
    <TableRow>
      <TableCell>Pattern</TableCell>
      <TableCell align="right">Count</TableCell>
    </TableRow>
  </TableHead> */}
          <TableBody>
            {rows.map((row, i) => {
              // console.log('row',row)
              return (
                <TableRow
                  key={row.name}
                  onMouseOver={() => setHoveredRow(row)}
                  style={{
                    background:
                      hoveredRow == row ? "rgb(250,250,250)" : "white",
                  }}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ padding: "10px" }}>
                    {row.seq ? (
                      <ProvenanceIsolatedNodes
                        // key={}
                        nodes={row.seq}></ProvenanceIsolatedNodes>
                    ) : (
                      row.answer
                    )}
                  </TableCell>
                  {row.seq ? (
                    <TableCell align="right">
                      <svg width={100} height={34}>
                        <rect
                          x={0}
                          y={0}
                          width={countScale(row.count)}
                          height={30}
                          style={{
                            fill: "rgb(147 195 209)",
                            stroke: "white",
                            strokeWidth: "8px",
                          }}></rect>
                        <text
                          x={0}
                          y={20}
                          style={{ fontWeight: "bold", textAnchor: "start" }}>
                          {row.count}
                        </text>
                      </svg>
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

function ConditionCard({ condition, conditionName, classes, taskID }) {
  const [hoveredRow, setHoveredRow] = useState();

  let freqPattern = condition.patterns[0].topK;

  // let frequentActions = condition.actions.map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
  let filteredMetrics = condition.stats; //metrics.filter(m => m.group.taskID == task.taskID && m.group.condition == condition);

  let metricValues = [...new Set(filteredMetrics.map((m) => m.metric))]; // console.log(frequentActions)

  let frequentActions = freqPattern; //.slice(0,5);
  //  console.log(frequentActions)

  // let frequentActions = freqPattern[i].seq.map(a => ({ event: a, id: a, count: freqPattern[i].count, scale: colorScale(freqPattern[i].count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))

  frequentActions = frequentActions.map((action, i) => {
    action.seq = freqPattern[i].seq.map((a) => {
      return { event: a, id: a, count: action.count };
    });
    return action;
  }); //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))

  return (
    <React.Fragment key={"taskcard_" + conditionName}>
      <Typography className={classes.condition} variant="overline">
        {conditionName}
      </Typography>

      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="flex-start" spacing={2}>
            <Grid key={"cat"} item>
              <Box mt={"5px"} mb={"6px"} mr={"10px"} boxShadow={1}>
                <CardMedia
                  style={{ display: "inline-block" }}
                  className={classes.media}
                  component="img"
                  image={require("../static/taskImages/" +
                    taskID +
                    "_" +
                    conditionName +
                    ".png")}
                  // image="https://placekitten.com/g/100/100"
                  title="Task 1 AM"
                />
              </Box>
              <Typography
                className={classes.pos}
                variant="overline"
                color="primary">
                Stimulus
              </Typography>
            </Grid>

            <Grid key={"prov"} item>
              <Box
                height={rowHeight}
                width={400}
                mt={"5px"}
                mb={"6px"}
                mr={"10px"}
                boxShadow={1}
                style={{ overflow: "scroll" }}>
                {
                  <TableComponent
                    rows={frequentActions}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}></TableComponent>
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
                    let value = filteredMetrics.find((m) => m.metric == metric);
                    if (value.type == "int" || value.type == "float") {
                      return (
                        <Grid key={metric} item>
                          {<Histogram data={value} ci={value.ci} />}
                          <Typography
                            style={{ display: "block" }}
                            color="primary"
                            variant="overline">
                            {metric}
                          </Typography>
                        </Grid>
                      );
                    }
                    if (value.type == "text") {
                      return (
                        <Grid key={metric} item>
                          <BarChart data={value}></BarChart>
                          <Typography
                            style={{ display: "block" }}
                            color="primary"
                            variant="overline">
                            {metric}
                          </Typography>
                        </Grid>
                      );
                    }
                    return <></>;
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
                  {
                    <TableComponent
                      rows={condition.textAnswers}
                      classes={classes}></TableComponent>
                  }
                </Box>
                <Typography
                  className={classes.pos}
                  variant="overline"
                  color="primary">
                  Qualitative Responses
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
      <Divider />
    </React.Fragment>
  );
}

export default function TaskCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const { data } = useContext(ProvenanceDataContext);

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
      {data.tasks.map((task) => {
        let taskTooltip = <Typography>{task.prompt}</Typography>;
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
                  style={{ display: "inline-block" }}>
                  {task.name}
                </Typography>
                {/* <Tooltip title={taskTooltip}> */}
                <Typography
                  className={classes.pos}
                  color="textSecondary"
                  style={{ display: "inline-block", marginLeft: "10px" }}>
                  {task.prompt + "  [" + task.answer + "]"}
                </Typography>
                {/* <Typography className={classes.pos} variant="caption" color="textSecondary" style={{display:'block'}}>
                       {task.answer}
                    </Typography> */}
                {/* </Tooltip> */}
                <Divider />

                {Object.keys(task.conditions).map((key) => {
                  let condition = task.conditions[key];
                  return (
                    <ConditionCard
                      condition={condition}
                      conditionName={key}
                      taskID={task.taskID}
                      classes={classes}></ConditionCard>
                  );
                })}
              </CardContent>
              <CardActions>
                <Button size="small">Explore</Button>
              </CardActions>
            </Card>
          </Box>
        );
      })}
    </>
  );
}

// const classes = useStyles();
// const bull = <span className={classes.bullet}>•</span>;

// const { data } = useContext(ProvenanceDataContext);

// // })
// let colorScale = d3.scaleLinear()
//     .domain([0, 800])
//     .range([0.3, 1])

//     // console.log(data)
// //Only render when all API calls have returned
// let ready = data;
// return (ready == undefined ? <></> : <>
//     {
//         data.tasks.map(task => {
//             let taskTooltip =
//                 <Typography>
//                     {task.prompt}
//                 </Typography>
//             return (<Box m={2} key={'box_' + task.taskID} style={{ display: 'inline-block' }} >
//                 {/* style={{ 'width': 600 }}  */}
//                 <Card className={classes.root} key={task.taskID}  >
//                     <CardContent>
//                         <Typography variant="h5" component="h2">
//                             {task.name}
//                         </Typography>
//                         <Tooltip title={taskTooltip}>
//                             <Typography className={classes.pos} color="textSecondary"  >
//                                 {task.prompt.slice(0, 60)}
//                             </Typography>
//                         </Tooltip>
//                         <Divider />

//                         {Object.keys(task.conditions).map(key => {
//                             let condition = task.conditions[key];
//                             //old way with /actions endpoint.
//                             let frequentActions = condition.actions.map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
//                             // let obj = actions.find(a => a.group.taskID == task.taskID && a.group.condition == condition).count
//                             // let frequentActions = Object.entries(obj).sort((a, b) => a[1] > b[1] ? -1 : 1).splice(0, 5).map(a => ({ event: a[0], id: a[0], count: a[1], scale: colorScale(a[1]) }))
//                             let filteredMetrics = condition.stats //metrics.filter(m => m.group.taskID == task.taskID && m.group.condition == condition);
//                             let metricValues = [... new Set(filteredMetrics.map(m => m.metric))];// console.log(frequentActions)

//                             return <>
//                                 <Typography variant='overline'>
//                                     {key}
//                                 </Typography>

//                                 <Grid container className={classes.root} spacing={2}>
//                                     <Grid item xs={12}>
//                                         <Grid container justify="flex-start" spacing={2}>
//                                             <Grid key={'prov'} item>
//                                                 <>
//                                                     <Box mt={'5px'} mb={'6px'} >
//                                                         <ProvenanceIsolatedNodes key={task.taskID} nodes={frequentActions}></ProvenanceIsolatedNodes>
//                                                     </Box>
//                                                     <Typography className={classes.pos} variant='overline' color="primary"  >
//                                                         Actions
//                                                     </Typography>
//                                                 </>
//                                             </Grid>
//                                             <Box mt={'15px'}>
//                                                 <Grid key={'then'} item>
//                                                     <TrendingFlatIcon />
//                                                 </Grid>

//                                             </Box>
//                                             {metricValues.map(metric => {
//                                                 let value = filteredMetrics.find(m => m.metric == metric)
//                                                 if (value.type == 'int' || value.type == 'float') {
//                                                     return <Grid key={metric} item>
//                                                         {histogram(value, value.ci)}
//                                                         <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
//                                                             {metric}
//                                                         </Typography>
//                                                     </Grid>
//                                                 }
//                                                 if (value.type == 'text') {
//                                                     return <Grid key={metric} item>
//                                                         {barChart(value)}
//                                                         <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
//                                                             {metric}
//                                                         </Typography>
//                                                     </Grid>
//                                                 }
//                                                 return <></>

//                                             })}
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                                 <Divider />
//                             </>

//                         }
//                         )}
//                         <div>

//                         </div>

//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Explore</Button>
//                     </CardActions>
//                 </Card>
//             </Box>)
//         }

//         )
//     }

{
  /* <Box m={2} style={{ display: 'inline-block' }} >
<Card className={classes.root} key={'participantOverview'}  >
    <CardContent>
        <Typography variant="h5" component="h2">
            Participant Overview
    </Typography>
        <Tooltip title={'Participant Overview'}>
            <Typography className={classes.pos} color="textSecondary"  >
                Average Demographics
        </Typography>
        </Tooltip>
        <Divider />
        <Box mt={2} >
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="flex-start" spacing={2}>
                        {participants.map(value => {
                            if (value.type == 'int' || value.type == 'float') {
                                return <Grid key={value.metric} item>
                                    <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                        {value.metric}
                                    </Typography>
                                    {histogram(value, value.ci, { width: 200, height: 100 })}

                                </Grid>
                            }
                            if (value.type == 'text') {
                                return <Grid key={value.metric} item>
                                    <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                        {value.metric}
                                    </Typography>
                                    {barChart(value, { width: 200, height: 100 })}

                                </Grid>
                            }
                            return <></>

                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </CardContent>
</Card>
</Box> */
}
