import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import Divider from '@material-ui/core/Divider';

import * as labella from "labella"

import { List } from 'react-virtualized';

import { useFetchAPIData } from "../hooks/hooks";

// import * as PouchDB from 'pouchdb-browser';


import * as d3 from "d3";

import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceIsolatedNodes from "../components/ProvenanceIsolatedNodes";

import Grid, { GridSpacing } from '@material-ui/core/Grid';
import { pathToFileURL } from "url";
import { keys } from "mobx";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        flexGrow: 1
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    }
});

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


function scale(width, maxValue) {
    return d3
        .scaleLinear()
        .range([10, width])
        .domain([0, maxValue]);
}

let xDomain, yDomain, categories;


export default function StudyCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    let { data,timelineData } = useContext(ProvenanceDataContext);

    Object.assign(data,timelineData) 
    // console.log('combinedData is ', data)

    function eventMap(eventData, size = { width: 130, height: 30 }) {

        let width = size.width;
        let height = size.height;

        let xScale = d3.scaleLinear().domain([0, xDomain[1]]).range([0, width - 40])
        let yScale = d3.scaleLinear().domain(yDomain).range([height, 0])

        //metrics to plot in each task label
        let metrics = ['accuracy']


        // let barHeight = 20;
        let barPadding = 2;
        let metricSquare = 8;
        let barHeight = 16
        let labelHeight = 15
        let textWidth = 30;
        let labelWidth = textWidth  //+ metrics.length * (metricSquare + barPadding) + textWidth  + barPadding
        let axisHeight = yScale.range()[0] + barHeight + 3

        //compute scale for data; 
        // let xDomain = d3.extent(data, d => d.elapsedTime);
        // let yDomain = d3.extent(data, d => d.level);
        // let colors = ["rgb(96, 201, 110)", "rgb(0, 191, 128)", "rgb(0, 180, 147)", "rgb(0, 167, 165)", "rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
        let colors = ["rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
        // let colors = [ "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2", "#9e0142", "#d53e4f", "#f46d43", "#fdae61","#fee08b", "#ffffbf", ]
       
        let colorScale = d3.scaleOrdinal(colors).domain(categories);

        let color = function (d) {
            return (d.eventID == 'task' ? 'rgba(171,171,171,0.5)' : d.eventID == 'browse away' ? 'black' : colorScale(d.category))
        }

        let hoverFill = function (d) {
            return (d.uniqueID == hoveredElement ? '#ff5800' : 'rgba(171, 171, 171, 0.5)')
        }

        let maxTime = Math.max(...eventData.map(d => d.elapsedTime + d.duration))
        let phases = eventData.filter(d => d.level == 0)

        var filteredData = eventData.filter(d => d.eventID == 'task' && d.taskID && d.taskID).sort((a, b) => a.elapsedTime > b.elapsedTime ? 1 : - 1);
    
        //compute y position for labels
        let y = 1;
        let labelPos = [];

        let nodes = filteredData.map(d => {
            let labelStart = xScale(d.elapsedTime)
            let labelExtent = xScale(d.elapsedTime) + labelWidth + 8;
            let level = labelPos.find(p => p.x < labelStart);
            let n = {};
            n['data'] = d;
            if (!level) {
                y = y + 1;
                labelPos.push({ y, x: labelExtent, label: d.shortName })
                n['y'] = y;
            } else {
                n['y'] = level.y
                labelPos = labelPos.filter(p => p.y !== level.y);
                labelPos.push({ y: level.y, x: labelExtent, label: d.shortName })
                labelPos.sort((a, b) => a.y < b.y ? -1 : 1)
            }
            n['labelWidth'] = labelWidth
            return n;
        })

        let metricColorScales={}; //one color scale per metric
        let metricYScales={} // one y scale per metric
        let taskTimeScales = {} // one time scale per task (depending on the range of completion times)

        let colorRange = ["#e6550d", "#3182bd"];
        let heightRange = [barPadding, labelHeight - barPadding]
        let timeScaleRange = [barPadding, textWidth-2*barPadding];

 
        let getStats = function(taskID,condition,metric){
            let taskInfo = data.tasks.find(dd => dd.taskID == taskID);
            let out = {}
            if (taskInfo) {
                let stats = taskInfo.conditions[condition.trim()].stats.find(t => t.metric == metric);
                if (stats){
                    out['average'] = stats.ci[0];
                out['lowerBound'] = stats.ci[1];
                out['upperBound'] = stats.ci[2];
                out['min'] =stats.min;
                out['max'] = stats.max;

                }
                
            }
            return out
        }

        //get stats for all metrics to be displayed in the label plus time. 
        nodes.map(n=>{
            n.data.stats={}
            metrics.map(metric=>{
                n.data.stats[metric] = getStats(n.data.taskID,n.data.condition,metric)
            })
            n.data.stats['time'] = getStats(n.data.taskID,n.data.condition,'time')
        })

        metrics.map(metric => {
            //create metric scales for color and height of bars
            metricColorScales[metric] = d3.scaleLinear().range(colorRange).domain(data.metrics[metric])
            metricYScales[metric] = d3.scaleLinear().range(heightRange).domain(data.metrics[metric])
        })

        data.taskList.map(task => {
            data.conditions.map(condition => {
                let stats = getStats(task, condition, 'time')
                //WARNING, right now setting a single range for time, regardless of task/condtion since the backend returns a common scale for all metrics
                taskTimeScales[task] = d3.scaleLinear().range(timeScaleRange).domain([stats['min'], stats['max']])
            })
        })

        // console.log(nodes)
        // console.log('nodePos',labelPos)


        return (
            <svg width={width} height={300} >
                {/* add axis */}
                {/* {console.log(data.map(d=>d.elapsedTime), Math.max(...data.map(d=>d.elapsedTime)))} */}
                <g style={{ "transform": "translate(0px, 200px)" }}>
                    {/* <line x1={0} y1={axisHeight} x2={xScale(maxTime) + 5} y2={axisHeight} style={{ "stroke": "rgb(0,0,0,0.25)", "strokeWidth": 1 }}></line> */}
                    {eventData.map((d, i) => {
                        let rectWidth = (xScale(d.duration) > 5) ? xScale(d.duration) - barPadding : xScale(d.duration)

                        let barComponent = <React.Fragment key={d.participantID + '_' + Math.random()}>
                            {/* <Tooltip title={(d.eventID == 'task' ? d.taskID : d.eventID) + " [" + d.duration + ' / ' + d.accuracy + "]"}> */}
                            <rect className='count' key={'d_' + d.eventID + '_' + d.elapsedTime} onMouseOver={() => hovered(d)} onMouseOut={() => setHovered(undefined)} style={{ fill: color(d), opacity: (d.eventID == 'task' ? .8 : .6) }} // "rgb(93, 131, 210)"
                                x={xScale(d.elapsedTime) + barPadding}
                                y={yScale(d.level)}
                                width={rectWidth}
                                height={d.eventID == 'task' ? barHeight : barHeight / 2}></rect>


                            {/* </Tooltip> */}

                        </React.Fragment>

                        //  console.log('taskInfo', taskInfo)

                        return barComponent
                    }

                    )}

                    {nodes.map(n => <line x1={xScale(n.data.elapsedTime) + barPadding} y1={yScale(n.data.level) + 15} x2={xScale(n.data.elapsedTime) + barPadding} y2={yScale(n.y)+labelHeight} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '.8px'}}></line>)}

                    {nodes.map(n => {
                        let ciPlot, background;

                        let timeScale = taskTimeScales[n.data.taskID];

                        let label = <g style={{ "transform": "translate(" + (xScale(n.data.elapsedTime)+barPadding) + "px, " + (yScale(n.y)) + "px)" }}>
                        <rect className='count' key={'background_' + n.data.eventID} style={{ fill: 'rgb(245,245,245)' }}
                                x={0}
                                y={0}
                                width={labelWidth}
                                height={labelHeight}></rect>

                            <line x1={0} y1={labelHeight} x2={n.labelWidth} y2={labelHeight} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '.8px' }}></line>

                            <text
                                style={{ fontSize: ".75em", fontWeight:'bold', textAnchor: "start", fill: 'rgb(90,90,90)', alignmentBaseline: "hanging" }}
                                x={barPadding*2}
                                y={barPadding}>
                                {" "}
                                {n.data.shortName}{" "}
                            </text>
                        </g>

                        if (Object.keys(n.data.stats).includes('time')) {
                            let plotHeight  = yScale(n.y) + barHeight
                            let maxWidth = Math.max(xScale(n.data.duration) + barPadding, xScale(n.data.upperBound));

                            let avg = n.data.stats['time'].average
                            let slower = avg < n.data.duration;
                            let minTime = Math.min(avg,n.data.duration)
                            let diff = Math.abs(avg - n.data.duration)

                            let timePadding = 2;
                            let glyphSize = 4;
                            let lineHeight = 2;

                            ciPlot = <g style={{ "transform": "translate(" + (xScale(n.data.elapsedTime) + (labelWidth - textWidth) + barPadding) + "px, " + (yScale(n.y)) + "px)" }}>

                                <line x1={timeScale.range()[0]} y1={labelHeight/2+lineHeight/2} x2={timeScale.range()[1]} y2={labelHeight/2+lineHeight/2} style={{ stroke: 'rgb(200,200,200)', strokeWidth: '.8px' }}></line>

                       

     {/*
                                <line
                                    className="count"
                                    style={{ stroke: "black", strokeWidth: 3, opacity: 0.5 }}
                                    x1={compressedTimeScale(n.data.lowerBound)}
                                    x2={compressedTimeScale(n.data.upperBound)}
                                    y1={0}
                                    y2={0}></line> */}
                                    {/* // PROBLEM HERE */}
                                <rect x={timeScale(minTime)} y={timePadding} width={Math.abs(timeScale(avg) - timeScale(n.data.duration))} height={labelHeight - 2 * timePadding} style={{ fill: slower ? '#ff8d00' : 'rgb(53 130 184)', opacity: '.8' }}></rect>

                                <rect x={timeScale(minTime)} y={labelHeight/2} width={timeScale(diff)} height={lineHeight} style={{ fill: slower ? '#ff8d00' : 'rgb(53 130 184)', opacity: '.8' }}></rect>
                                {/* <rect x={timeScale(avg)} y={timePadding} width={1} height={labelHeight - 2 * timePadding} style={{ fill: 'black', opacity: '1', 'rx': 0 }}></rect> */}

                                {/* <rect x={0} y={0} width ={glyphSize} height={glyphSize}  transform ={"translate(" + timeScale(avg) + "," +  (labelHeight/2) + ") rotate(45,2,2)"} style={{ fill: 'black', opacity: '1'}}></rect> */}
                                <rect x={0} y={0} width ={glyphSize} height={glyphSize}  style={{ fill: 'black', opacity: '1', transform: "translate(" + timeScale(avg) + "px," +  (labelHeight/2 - glyphSize/2) + "px) rotate(45deg)"}}></rect>

                                <rect x={0} y={0} width ={glyphSize} height={glyphSize}  style={{ fill: 'red', opacity: '1', transform: "translate(" + timeScale(n.data.duration) + "px," +  (labelHeight/2 - glyphSize/2) + "px) rotate(45deg)"}}></rect>


                                {/* <circle
                                    className="count"
                                    style={{ stroke: "black", opacity: 1, strokeWidth: '1px' }}
                                    cx={ slower ? compressedTimeScale.range()[0] : compressedTimeScale(diff)  }
                                    cy={0}
                                    r={1}></circle> */}

                                {/* <line x1={compressedTimeScale(n.data.average)} y1={-3} x2={compressedTimeScale(n.data.average)} y2={3} style={{ stroke: 'black', strokeWidth: '1px' }}></line> */}

                                {/* <line x1={compressedTimeScale(n.data.duration)} y1={-3} x2={compressedTimeScale(n.data.duration)} y2={3} style={{ stroke: '#ff5e00', strokeWidth: '1px' }}></line> */}


                            </g>
                        }
                        return <> {background} {label}   </> // {ciPlot}
 

                    })}

                    {nodes.map(n => {

                        let metricPlot = <>
                            {metrics.map((m, i) => {

                                let avg = n.data.stats[m].average;
                                let value = n.data[m]
                                let vertScale = metricYScales[m];
                                let colorScale = metricColorScales[m];
                                let better = value > avg;
                                let maxValue = Math.max(avg, value)
                                let diff = Math.abs(avg - value)


                                return <g style={{ "transform": "translate(" + (xScale(n.data.elapsedTime) + textWidth + barPadding + i * (metricSquare + barPadding)) + "px, " + yScale(n.y) + "px)" }}>
                                    {/* <line x1={xScale(n.data.elapsedTime) + textWidth + i * (metricSquare + barPadding)} y1={yScale(n.y)} x2={xScale(n.data.elapsedTime) + textWidth  + i * (metricSquare + barPadding)} y2={yScale(n.y) + labelHeight} style={{ "stroke": "rgb(0,0,0,0.25)", "strokeWidth": .8 }}></line> */}
                                    {/* <rect className='count' key={'d_' + n.data.eventID + Math.random()} style={{ fill: colorScale(value), opacity: 1 }} // 'rx': metricSquare 
                                        x={0}
                                        y={labelHeight - yScale(value)}
                                        width={n.data.eventID == 'task' ? metricSquare : 0}
                                        height={2}></rect> */}
                                    <rect className='count' key={'d_' + n.data.eventID + Math.random()} style={{ fill: 'black', opacity: 1 }} // 'rx': metricSquare 
                                        x={0}
                                        y={labelHeight - vertScale(avg)}
                                        width={n.data.eventID == 'task' ? metricSquare : 0}
                                        height={1}></rect>

                                    {/* <rect className='count' key={'d_' + n.data.eventID + Math.random()} style={{ fill: 'red', opacity: 1 }} // 'rx': metricSquare 
                                        x={-5}
                                        y={labelHeight - vertScale(value)}
                                        width={n.data.eventID == 'task' ? metricSquare + 5 : 0}
                                        height={.5}></rect> */}


                                    <rect className='count' key={'d_' + n.data.eventID + Math.random()} style={{ fill: colorScale(value), opacity: .8 }} // 'rx': metricSquare 
                                        x={0}
                                        y={labelHeight - vertScale(maxValue)}
                                        width={n.data.eventID == 'task' ? metricSquare : 0}
                                        height={Math.abs(vertScale(avg) - vertScale(value))}></rect>

                                    {/* {i == metrics.length - 1 ? <line x1={xScale(n.data.elapsedTime) + textWidth + barPadding + (i + 1) * (metricSquare + barPadding)} y1={yScale(n.y)} x2={xScale(n.data.elapsedTime) + textWidth + barPadding + (i + 1) * (metricSquare + barPadding)} y2={yScale(n.y) + labelHeight} style={{ "stroke": "rgb(0,0,0,0.25)", "strokeWidth": .8}}></line> */}
                                        {/* : ''} */}

                                </g>
                            })}
                        </>

                        return <></> //metricPlot
                    }


                    )}
                    {phases.map(p =>
                        <text
                            style={{ fontSize: "1em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                            x={xScale(p.elapsedTime)}
                            y={axisHeight + 5}>
                            {" "}
                            {p.label}{" "}
                        </text>
                    )}
                    <text
                        style={{ fontSize: "1em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                        x={xScale(maxTime) + 5}
                        y={axisHeight - 7}>
                        {" "}
                        {Math.round(maxTime) + ' min'}{" "}
                    </text>


                </g>
            </svg>)
    }

    function hovered(d) {
        if (hoveredElement !== d.uniqueID) {
            setHovered(d.uniqueID)
        }

    }

    useEffect(() => {
        if (data) {
            participants = data.participants
            participants.map(p => {
                p.study.map(d => {
                    d.uniqueID = d.eventID + '_' + Math.random()
                })
            })
        }

    }, [data])

    let [hoveredElement, setHovered] = useState();

    let participants, conditionGroups;
    if (data) {
        participants = data.participants
        //the concept of a single condition per participant is not always valid. 
        // participants.map(p => p.condition = p.study[0].condition)
        let allLevels = participants.map(p => p.study.map(s => s.level)).flat();
        // console.log(allLevels)
        categories = [... new Set(participants.map(p => p.study.map(s => s.category)).flat())];
        xDomain = d3.extent(participants, d => d.minutesToComplete);
        yDomain = d3.extent(allLevels);
        // console.log(yDomain)
        conditionGroups = groupBy(participants, 'condition');
    }


    // })
    let colorScale = d3.scaleLinear()
        // .domain(d3.extent(allCounts))
        .domain([0, 800])
        .range([0.3, 1])

    //Only render when all API calls have returned 
    let ready = data;
    // if (ready) {
    //     // console.log(data)
    // }
    // console.log('events', eventGroups)
    return (ready == undefined ? <></> : <React.Fragment key={'events'}>
        <Box m={2} style={{ display: 'inline-block' }} >
            <Card className={classes.root} key={'participantOverview'}  >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Participant Timeline
                </Typography>
                    {/* <Typography className={classes.pos} color="textSecondary"  >
                        Event Sequences
                    </Typography> */}
                    <Divider />
                    <Box mt={2} >
                        <Grid container className={classes.root} spacing={2}>
                            {Object.keys(conditionGroups).map(cond =>
                                <Grid item xs={12} key={cond}>
                                    <Grid container justify="flex-start" spacing={2}>
                                        {/* <Box display="flex" justifyContent="center" p={2}>
                                            <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                {cond}
                                            </Typography>
                                        </Box> */}

                                        <Divider />

                                        {conditionGroups[cond].slice(0, 5).map(participant => {
                                            return <>
                                                <Grid key={participant.participantID} item>
                                                    <Box borderBottom={1} boxShadow={0} p={1} style={{ borderColor: 'rgba(171, 171, 171, 0.5)' }}>
                                                        {/* <Box display="flex" justifyContent="flex-end"> */}

                                                        <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                            {'ParticipantID: ' + participant.participantID }
                                                        </Typography>
                                                        <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                            {'Avg. Accuracy: ' + (Math.round(participant.averageAccuracy * 100) / 100 || undefined) }
                                                        </Typography>
                                                        {/* <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                                {'ID:' + participant.participantID.slice(0, 3) + '...' + participant.participantID.slice(-3)}
                                                            </Typography> */}
                                                        {/* </Box> */}

                                                        {eventMap(participant.study, { width: 1600, height: 25 })}
                                                    </Box>

                                                </Grid>
                                            </>
                                        }

                                        )}
                                    </Grid>
                                </Grid>)}

                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>

    </React.Fragment>

    );
}


// virtualized list
{/* <Grid container className={classes.root} spacing={2}>
{ Object.keys(conditionGroups).map(cond=>{
    let group = conditionGroups[cond];
    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) {
          let el = group[index]
        return (
            <Grid key={el.participantID} item>
            <Typography style={{ display: 'block' }} color="primary" variant='subtitle1'  >
            {'Avg. Accuracy: ' + el.averageAccuracy}
            </Typography>
            <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
            {el.participantID.slice(0,3) + '...' +  el.participantID.slice(el.participantID.length-4,3)}
            </Typography>
            
            {eventMap(el.study, { width: 800, height: 50 })}
            </Grid>
        );
      }

      return <>                            
    <Grid item xs={6}>
    <Grid container justify="flex-start" spacing={2}>
    <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
     {cond}
    </Typography>
    <Divider />
    <List
            width={1000}
            height={1000}
            rowCount={group.length}
            rowHeight={20}
            rowRenderer={rowRenderer}
            />
              </Grid>
    </Grid>
        </>

    }
        // conditionGroups[cond].map(participant =>{
         
  )})

</Grid> */}
