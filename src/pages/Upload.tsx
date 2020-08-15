import React, { useContext } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import Divider from "@material-ui/core/Divider";

import { useFetchAPIData } from "../hooks/hooks";

// import * as PouchDB from 'pouchdb-browser';

import * as d3 from "d3";

import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceIsolatedNodes from "../components/ProvenanceIsolatedNodes";

import Grid, { GridSpacing } from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    flexGrow: 1,
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


function scale(width, maxValue) {
  return d3.scaleLinear().range([10, width]).domain([0, maxValue]);
}



export default function Upload() {

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
              style={{ display: "inline-block" }}>
              {/* style={{ 'width': 600 }}  */}
              <Card className={classes.root} key={task.taskID}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {task.name}
                  </Typography>
                  <Tooltip title={taskTooltip}>
                    <Typography className={classes.pos} color="textSecondary">
                      {task.prompt.slice(0, 60)}
                    </Typography>
                  </Tooltip>
                  <Divider />

                  {Object.keys(task.conditions).map(key => {
                    let condition = task.conditions[key];
                    let freqPattern = condition.patterns[0].topK;

                    // let frequentActions = condition.actions.map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))
                    let filteredMetrics = condition.stats //metrics.filter(m => m.group.taskID == task.taskID && m.group.condition == condition);

                    let metricValues = [
                      ...new Set(filteredMetrics.map((m) => m.metric)),
                    ]; // console.log(frequentActions)

                    let nodeWidth = 25;
                    let characterWidth = 5;
                    let textHeight = 8
                    let xScale = d3.scaleLinear().domain([0, 1]).range([0, nodeWidth + 10])
                    let yScale = d3.scaleLinear().domain([0, 1]).range([0, 15])
                    let colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(data.actions);

                    let renderPattern = function (nodes) {
                      let background = nodes.map((n) => {
                        return <>

                          <line x1={n.x + nodeWidth / 2} y1={yScale(n.y)} x2={n.x + nodeWidth / 2} y2={yScale(0) + nodeWidth} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '1.2px', 'strokeLinecap':'round' }}></line>
                          <line x1={n.x + nodeWidth / 2} y1={yScale(n.y)} x2={n.x + nodeWidth / 2 + 3} y2={yScale(n.y)} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '1.2px' }}></line>
                          <rect className='count' key={'background_' + n.event} style={{ fill: colorScale(n.data.event), stroke: 'white', strokeWidth: '1px', 'rx': 2 }}
                            x={n.x}
                            y={yScale(0)}
                            width={nodeWidth}
                            height={nodeWidth}></rect>
                        </>

                      })

                      let labels = nodes.map((n) => {
                        return <>
                          <rect className='count' key={'background_' + n.event} style={{ fill: 'white', stroke: 'white', strokeWidth: '1px' }}
                            x={n.x + nodeWidth / 2+3}
                            y={yScale(n.y)-2}
                            width={n.labelExtent}
                            height={textHeight}></rect>

                          <text
                            style={{ fontSize: ".75em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                            x={n.x + nodeWidth / 2 + 5 }
                            y={yScale(n.y) + textHeight/2}>
                            {" "}
                            {n.data.event}{" "}
                          </text>
                        </>

                      })

                      return <svg width={300} height={yScale(Math.max(...nodes.map(n => n.y))) + 50} >
                        <g style={{ "transform": "translate(50px, 30px)" }}>

                          {background} {labels}
                        </g>


                      </svg>
                    }

                    return (
                      <React.Fragment key={'taskcard_' + key}>
                        <Typography variant="overline">{key}</Typography>

                        <Grid container className={classes.root} spacing={2}>
                          <Grid item xs={12}>
                            <Grid container justify="flex-start" spacing={2}>
                              <Grid key={"prov"} item>
                                <>{[0, 1, 2].map(i => {
                                  let frequentActions = freqPattern[i].seq.map(a => ({ event: a, id: a, count: freqPattern[i].count, scale: colorScale(freqPattern[i].count) })) //actions.filter(a => a.taskID == task.taskID && a.condition == condition).splice(0, 5).map(a => ({ event: a.label, id: a.actionID, count: a.count, scale: colorScale(a.count) }))

                                  let evenlabelPos = []
                                  let eveny = 1;
                                  let labelPos = []
                                  let y = 0.5;
                                  let nodes = frequentActions.map((d, i) => {
                                    // console.log(d.shortName)
                                    let labelStart = xScale(i)
                                    let labelExtent = d.event.length * characterWidth + 30;
                                    let n = {};
                                    n['data'] = d;
                                    let level
                                    if (i%2 == 0) {
                                       level = evenlabelPos.find(p => p.x < labelStart);
                                    }else{
                                      level = labelPos.find(p => p.x < labelStart);
                                   }
                                    // console.log(level)
                                    if (!level) {
                                      if (i%2 == 0){
                                        eveny = eveny + 1;
                                        evenlabelPos.push({ y:eveny, x: labelExtent, label: d.shortName })
                                        n['y'] = eveny;
                                      } else {
                                        y = y - 1;
                                        labelPos.push({ y, x: labelExtent, label: d.shortName })
                                        n['y'] = y;
                                      }
                                  
                                    } else {

                                      if (i % 2 == 0) {
                                        n['y'] = level.y
                                        labelPos = labelPos.filter(p => p.y !== level.y);
                                        labelPos.push({ y: level.y, x: labelExtent, label: d.shortName })
                                        labelPos.sort((a, b) => a.y < b.y ? -1 : 1)
                                      } else {
                                        n['y'] = level.y
                                        labelPos = labelPos.filter(p => p.y !== level.y);
                                        labelPos.push({ y: level.y, x: labelExtent, label: d.shortName })
                                        labelPos.sort((a, b) => a.y < b.y ? -1 : 1)
                                      }

                                      
                                    }
                                    n['x'] = labelStart;
                                    n['labelExtent'] = labelExtent
                                    return n;
                                  })

                                  return <Box mt={"5px"} mb={"6px"}>
                                    {renderPattern(nodes)}
                                  </Box>
                                }
                                )}
                                </>
                              </Grid>
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
