import React, { useContext } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from '@material-ui/core/CardMedia';

import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import Divider from "@material-ui/core/Divider";


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';



import { useFetchAPIData } from "../hooks/hooks";

// import * as PouchDB from 'pouchdb-browser';

import * as d3 from "d3";

import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceIsolatedNodes from "../components/ProvenanceIsolatedNodes";

import Grid, { GridSpacing } from "@material-ui/core/Grid";
import { pathToFileURL } from "url";
import { keys } from "mobx";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    flexGrow: 1,
  },
  media:{
    width:411,
    height:217,
    border: '1px solid lightgray'
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
    <svg width={100} height={25} key={d.key}>
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
  const { data, ci, size = { width: 130, height: 40 }, commonScales } = props;

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
    .range([0, width - 40]);

  let yScale = d3.scaleLinear().domain(yDomain).range([0, barHeight]);

  let barWidth = xScale(data.bins[1] - xScale(data.bins[0])) - barPadding;

  let textLabel = Math.round(average * 10) / 10; //label == '%' ? (Math.round(average * 100) + ' ' + label) : Math.round(average * 10) / 10 + ' ' + label

  return (
    <svg width={width} height={height}>
      {/* add axis */}
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
          style={{ fill: "rgb(93, 131, 210)" }}
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

function BarChart(props) {
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
}

export default function TaskCard() {
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
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const { data } = useContext(
    ProvenanceDataContext
  );

  // })
  let colorScale = d3
    .scaleLinear()
    // .domain(d3.extent(allCounts))
    .domain([0, 800])
    .range([0.3, 1]);

  //Only render when all API calls have returned
  let ready = data
  // console.log('actions', actions)
  return ready == undefined ? (
    <></>
  ) : (
      <>

        {data.tasks.map(task => {
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
                  <Typography variant="h5" component="h2" style={{display:'inline-block' }}>
                    {task.name}
                  </Typography>
                  {/* <Tooltip title={taskTooltip}> */}
                    <Typography className={classes.pos} color="textSecondary" style={{display:'inline-block', marginLeft:'10px'}}>
                       {task.prompt}
                    </Typography>
                    <Typography className={classes.pos} variant="caption" color="textSecondary" style={{display:'block'}}>
                       {task.answer}
                    </Typography>
                  {/* </Tooltip> */}
                  <Divider />

                  {Object.keys(task.conditions).map(key => {
                    let condition = task.conditions[key];
                    let freqPattern = condition.patterns[0].topK;

                    // let frequentActions = condition.actions.map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
                    let filteredMetrics = condition.stats //metrics.filter(m => m.group.taskID == task.taskID && m.group.condition == condition);

                    let metricValues = [
                      ...new Set(filteredMetrics.map((m) => m.metric)),
                    ]; // console.log(frequentActions)

                    let countScale = d3.scaleLinear().range([0,100]).domain([0,300])

                    return (
                      <React.Fragment key={'taskcard_' + key}>
                        <Typography variant="overline">{key}</Typography>

                        <Grid container className={classes.root} spacing={2}>
                          <Grid item xs={12}>
                            <Grid container justify="flex-start" spacing={2}>
                            <Grid key={'cat'} item>
                            <Box mt={"5px"} mb={"6px"} mr={'10px'}>
                                <CardMedia
                                  style={{ display: "inline-block" }}
                                  className={classes.media}
                                  component="img"
                                  image = {require('../static/taskImages/' + task.taskID + '_' + key + '.png')}
                                  // image="https://placekitten.com/g/100/100"
                                  title="Task 1 AM"
                                />
                                </Box>
                              </Grid>
                              

                              <Grid key={"prov"} item>
                                <>{[0, 1, 2,3,4].map(i => {
                                  let frequentActions = freqPattern[i].seq.map(a => ({ event: a, id: a, count: freqPattern[i].count, scale: colorScale(freqPattern[i].count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
                                  return <>
                                    <Box style={{ display: 'block' }}>
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

                                  <Typography
                                    className={classes.pos}
                                    variant="overline"
                                    color="primary">
                                    Actions
                                </Typography>
                                </>
                              </Grid>
                              <Box mt={"15px"}>
                                <Grid key={"then"} item>
                                  <TrendingFlatIcon />
                                </Grid>
                              </Box>
                              {metricValues.map((metric) => {
                                let value = filteredMetrics.find(
                                  (m) => m.metric == metric
                                );
                                if (
                                  value.type == "int" ||
                                  value.type == "float"
                                ) {
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
                              {condition.textAnswers.map(txt=>{
                                return <List dense={true}>
                                <ListItem>
                                  <ListItemText
                                    primary={txt.answer}
                                    secondary={null}
                                  />
                                </ListItem>
                            </List>
                              })}
                              



                            </Grid>

                          </Grid>
                        </Grid>
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                  <div></div>
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


{/* <Box m={2} style={{ display: 'inline-block' }} >
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
</Box> */}
