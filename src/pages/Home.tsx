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

import Fab from '@material-ui/core/Fab';


import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import SortIcon from '@material-ui/icons/Sort';

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

  const { data, ci, size = { width: 100, height: 40 }, onHandleBrush, hoveredRow } = props;

  let[hovered,setHovered]=useState(false)

  let menu = function () {
    return <><rect
      x={0}
      y={0}
      width={width}
      height={height}
      rx={5}
      fill={'white'}
      opacity={.5}></rect>


      <g transform={`translate(0,0)`}>{<SortIcon width={
      16
    }
      height={
        16
      }/>}
      <text x={20} y={10}>Sort</text>
      </g>
      
      </>
  }

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
  // let histogramBars = data.hist.map((d, i) => (
  //   <rect
  //     className="count"
  //     key={"d_" + data.bins[i]}
  //     style={{ fill: "rgb(93, 131, 210)" }}
  //     x={xScale(data.bins[i]) + barPadding / 2}
  //     y={barHeight - yScale(d)}
  //     width={barWidth}
  //     height={yScale(d)}></rect>
  // ));


  function HistogramComponent({data}){
    // const { data, ci, size = { width: 150, height: 40 }, commonScales, hovered } = props;

    return  <><line
    x1={0}
    y1={yScale.range()[1]}
    x2={xScale.range()[1]}
    y2={yScale.range()[1]}
    style={{ stroke: "rgb(0,0,0,0.25)", strokeWidth: 1 }}></line>
  {data.hist.map((d, i) => (
    <rect
      className="count"
      key={"d_" + data.bins[i]}
      style={{ fill:"rgb(93, 131, 210)" }}
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
  </>
  }


  return (<>
    <svg width={width} height={height} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <HistogramComponent data={hoveredRow || data}></HistogramComponent>
      {/* add axis */}
      {hovered ? menu() : <></>}
    </svg>
  </>

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
let countScale = d3.scaleLinear().range([0, 75]).domain([0, 137]);

function Stimulus({taskID,conditionName,classes}){
  // console.log('am rerendering')
  return  <><Box mt={"5px"} mb={"6px"} mr={"10px"} boxShadow={1}>
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
</>
}

function SequenceCount({row,hoveredRow}){
  let total = 137;
  let height =25;
  let iconWidth = 3;
  let padding = 1;
  let numIconsPerCol = Math.floor(height/(iconWidth+padding))
  let numCols = Math.ceil(total/numIconsPerCol)
  let width = numCols*(iconWidth+padding) 

  let textWidth = 25

  let xScale = d3.scaleLinear().range([0,iconWidth+padding]).domain([0,1])
  let yScale = d3.scaleLinear().range([0,height]).domain([0,numIconsPerCol])

  let currentParticipants = row.matchingSequences.map(s=>s.participantID)
  let hoveredParticipants = hoveredRow ? hoveredRow.matchingSequences.map(s=>s.participantID) : []

  let intersection = currentParticipants.filter(x => hoveredParticipants.includes(x));
  

  // width = countScale.range()[1]

  return  <svg width={width+textWidth} height={height}>
  {Array.from(Array(total).keys()).map(key=>{
    return <rect
    x={xScale(Math.floor(key/numIconsPerCol))}
    y={yScale(key%numIconsPerCol)+padding}
    width={iconWidth}
    height={iconWidth}
    style={{
      // opacity: key < intersection.length ? 1 : .2,
      fill: key < intersection.length ? '#9100e6' : key < row.count ? "rgb(93, 131, 210)" :  'rgb(220, 220, 220)'  //rgb(147 195 209)
    }}></rect>
  })} 
  
  <text
    x={xScale(numCols)+padding}
    y={yScale(numIconsPerCol/2)}
    style={{ fontWeight: "bold", alignmentBaseline:'middle', textAnchor: "start" ,'fill':'rgb(93, 131, 210)' }}>
    {row.count}
  </text>
  
  
 
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
}

function TableComponent({rows,hoveredRow,setHoveredRow}){  
// console.log('rendering table',hoveredRow) 
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
              <TableRow key={row.id} onMouseEnter={() =>{setHoveredRow(row)}} onMouseLeave={() => setHoveredRow()} style={{background: hoveredRow == row? 'rgb(234,234,234)':'white'}} >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ padding: "10px"}}>
                    {row.seq ? (
                      <ProvenanceIsolatedNodes
                        // key={}
                        nodes={row.seqObj}></ProvenanceIsolatedNodes>
                    ) : (
                      row.answer
                    )}
                  </TableCell>
                  {row.seq ? (
                    <TableCell align="left">
                     <SequenceCount row = {row} hoveredRow = {hoveredRow}></SequenceCount>
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

function HistComponent({filteredMetrics,hoveredRow,metric}){

  // let hoveredStats = undefined; 
  // let hoveredCI = undefined;
  let value = filteredMetrics.find(
    (m) => m.metric == metric
  );
  if (
    value.type == "int" ||
    value.type == "float"
  ) {

    let hoveredStats = hoveredRow ? hoveredRow.stats.find(m=>m.metric == metric ) : undefined;
    let hoveredCI = hoveredStats ? hoveredStats.ci : undefined;
    return (
      <Grid key={metric+ '_hist'} item>
        {<Histogram key={metric+ '_histCompoment'} data={hoveredStats || value} ci={hoveredCI ||  value.ci} />}
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
      <Grid key={metric+'_bar'} item>
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

}

function ConditionCard({ condition, conditionName, classes, taskID }) {
  const [hoveredRow, setHoveredRow] = useState();

  let freqPattern, filteredMetrics, metricValues;

  //only compute when the condition changes
  // useEffect(() => {
    // console.log('calling use effect')
    freqPattern = condition.patterns[0].topK;
    filteredMetrics = condition.stats;

    metricValues = [...new Set(filteredMetrics.map((m) => m.metric))]; 

    freqPattern.map((action,i) => {
      action.id = i;
      action.seqObj = action.seq.map(a => ({ name: a, id: a, count: action.count }))
      return action
    }) 

  // }, [condition]);

  // console.log(metricValues)
  return (!metricValues ? <></> :
    <React.Fragment key={"taskcard_" + conditionName}>
      <Typography className={classes.condition} variant="overline">
        {conditionName}
      </Typography>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="flex-start" spacing={2}>
            <Grid key={"cat"} item>
              <Stimulus taskID={taskID} classes={classes} conditionName={conditionName}></Stimulus>
            </Grid>
            <Grid key={"prov"} item>
              <Box height={rowHeight} width={600} mt={"5px"} mb={"6px"} mr={'10px'} boxShadow={1} style={{ overflow: 'scroll' }}>
                {<TableComponent rows={freqPattern} hoveredRow={hoveredRow} setHoveredRow={setHoveredRow}></TableComponent>}
              </Box>
              <Typography
                className={classes.pos}
                variant="overline"
                color="primary">
                Actions
              </Typography>
            </Grid>
            <Grid key={'performanceMetrics'} item xs>
              <Grid key={'performanceMetrics'} item style={{ display: 'block' }}>
                <Box height={rowHeight / 2.5} p={"20px"} mt={"5px"} mb={"6px"} mr={'10px'} style={{ overflow: 'scroll', display: 'inline-flex' }} boxShadow={1}>
                  {metricValues.map((metric) => {
                    return <HistComponent filteredMetrics = {filteredMetrics} hoveredRow={hoveredRow} metric={metric}></HistComponent>
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

function TaskCard({task,classes}){

  let[hidden,setHidden]=useState(false)

  return <Box
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
        onClick={()=>{setHidden(!hidden)}}
        style={{ cursor:'pointer', display: "inline-block" }}>
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

      {hidden ? <></> : Object.keys(task.conditions).map((key) => {
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

}

export default function TaskContainer() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const { data } = useContext(ProvenanceDataContext);

  let[hidden,setHidden]=useState(false)


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
        // let taskTooltip = <Typography>{task.prompt}</Typography>;
        return (<TaskCard task={task} classes={classes}></TaskCard>);
      })}
    </>
  );
}
