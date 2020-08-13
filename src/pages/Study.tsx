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
    const { data } = useContext(ProvenanceDataContext);

    function eventMap(eventData, size = { width: 130, height: 30 }) {

        let width = size.width;
        let height = size.height;

        // let barHeight = 20;
        let barPadding = 2;
        let metricSquare = 8;
        let metrics = ['accuracy', 'difficulty', 'confidence']
        //compute scale for data; 
        // let xDomain = d3.extent(data, d => d.elapsedTime);
        // let yDomain = d3.extent(data, d => d.level);
        // let colors = ["rgb(96, 201, 110)", "rgb(0, 191, 128)", "rgb(0, 180, 147)", "rgb(0, 167, 165)", "rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
        let colors = ["rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
        // let colors = [ "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2", "#9e0142", "#d53e4f", "#f46d43", "#fdae61","#fee08b", "#ffffbf", ]
        let barHeight = 15

        let xScale = d3.scaleLinear().domain([0, xDomain[1]]).range([0, width - 40])
        let yScale = d3.scaleLinear().domain(yDomain).range([height, 0])
        let accuracyScale = d3.scaleLinear().domain([0, 1]).range(["#e6550d", "#3182bd"]) // "#3288bd"
        let confidenceScale = d3.scaleLinear().domain([1, 7]).range(["#e6550d", "#3182bd"]) // "#3288bd"
        let difficultyScale = d3.scaleLinear().domain([1, 7]).range(["#3182bd", "#e6550d"]) // "#3288bd"

        // let colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(categories);
        let colorScale = d3.scaleOrdinal(colors).domain(categories);

        let color = function (d) {
            return (d.eventID == 'task' ? 'rgba(171,171,171,0.5)' : d.eventID == 'browse away' ? 'black' : colorScale(d.category))
        }

        let hoverFill = function (d) {
            return (d.uniqueID == hoveredElement ? '#ff5800' : 'rgba(171, 171, 171, 0.5)')
        }

        let maxTime = Math.max(...eventData.map(d => d.elapsedTime + d.duration))
        let studyStart = eventData.find(d => d.eventID == 'study').elapsedTime
        let axisHeight = yScale.range()[0] + barHeight + 3

        let phases = eventData.filter(d => d.level == 0)


        var filteredData = eventData.filter(d => d.eventID == 'task' && d.category == 'Study').sort((a, b) => a.elapsedTime > b.elapsedTime ? 1 : - 1);
        let labelPos = [];
        let y = 1;
        let labelWidth = 25 + metrics.length * (metricSquare + barPadding)
        let nodes = filteredData.map(d => {
            // console.log(d.shortName)
            let labelStart = xScale(d.elapsedTime)
            let labelExtent = xScale(d.elapsedTime) + labelWidth + 8;
            let level = labelPos.find(p => p.x < labelStart);
            let n = {};
            n['data'] = d;
            // console.log(level)
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
            return n;
        })

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

                    {nodes.map(n => <line x1={xScale(n.data.elapsedTime) + barPadding} y1={yScale(n.data.level) + 15} x2={xScale(n.data.elapsedTime) + barPadding} y2={yScale(n.y)} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '.8px' }}></line>)}



                    {nodes.map(n => {
                        let taskInfo = data.tasks.find(dd => dd.taskID == n.data.taskID);
                        let stats, average, lowerBound, upperBound, ciPlot, background;



                        let label = <text
                            style={{ fontSize: ".75em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                            x={xScale(n.data.elapsedTime) + barPadding * 3}
                            y={yScale(n.y) + 10}>
                            {" "}
                            {n.data.shortName}{" "}
                        </text>

                        if (taskInfo) {
                            stats = taskInfo.conditions[n.data.condition.trim()].stats.find(t => t.metric == 'time');
                            average = stats.ci[0];
                            lowerBound = stats.ci[1];
                            upperBound = stats.ci[2];
                            let plotHeight = yScale(n.y) + barHeight
                            let maxWidth = Math.max(xScale(n.data.duration) + barPadding, xScale(upperBound));

                            background = <rect className='count' key={'background_' + n.data.eventID} style={{ fill:'white', stroke: 'white', strokeWidth: '1px', }}
                                x={xScale(n.data.elapsedTime) + barPadding}
                                y={yScale(n.y)}
                                width={Math.max(maxWidth, labelWidth)}
                                height={barHeight}></rect>

                            ciPlot = <>

                                {/* <rect className='count' key={'background_' + n.data.eventID} style={{ fill: 'white', stroke: 'white', strokeWidth: '1px', }}
                                    x={xScale(n.data.elapsedTime) + barPadding * 2}
                                    y={plotHeight-5}
                                    width={maxWidth}
                                    height={10}></rect> */}
                                <line x1={xScale(n.data.elapsedTime) + barPadding} y1={yScale(n.y) + barHeight} x2={Math.max(xScale(n.data.elapsedTime + n.data.duration) , xScale(n.data.elapsedTime + upperBound))} y2={yScale(n.y) + barHeight} style={{ stroke: 'rgb(150,150,150)', strokeWidth: '.8px' }}></line>


                                {/* <circle
                                    className="count"
                                    style={{ fill: "#ff5e00", opacity: 1 }}
                                    cx={xScale(n.data.elapsedTime + n.data.duration)}
                                    cy={plotHeight}
                                    r={3}></circle> */}

                                <circle
                                    className="count"
                                    style={{ stroke: "black", opacity: .5, strokeWidth: '1px' }}
                                    cx={xScale(n.data.elapsedTime + average)}
                                    cy={plotHeight}
                                    r={2}></circle>

                                {/* <line
                                    className="count"
                                    style={{ stroke: "black", strokeWidth: 2, opacity: 0.5 }}
                                    x1={xScale(n.data.elapsedTime + average)}
                                    x2={xScale(n.data.elapsedTime + average)}
                                    y1={yScale(n.y)}
                                    y2={yScale(n.y) + barHeight}></line> */}



                                <line
                                    className="count"
                                    style={{ stroke: "black", strokeWidth: 3, opacity: 0.5 }}
                                    x1={xScale(n.data.elapsedTime + lowerBound)}
                                    x2={xScale(n.data.elapsedTime + upperBound)}
                                    y1={plotHeight}
                                    y2={plotHeight}></line>

                                {/* <circle
                                    className="count"
                                    style={{ fill: "#ff5e00", opacity: 1 }}
                                    cx={xScale(n.data.elapsedTime + n.data.duration)}
                                    cy={plotHeight}
                                    r={3}></circle> */}

                                <line x1={xScale(n.data.elapsedTime + n.data.duration)} y1={plotHeight - 3} x2={xScale(n.data.elapsedTime + n.data.duration)} y2={plotHeight + 3} style={{ stroke: '#ff5e00', strokeWidth: '2px' }}></line>


                            </>
                        }
                        return <>{background} {ciPlot} {label} </>


                    })}

                    {nodes.map(n => <>
                        {metrics.map((m, i) => {

                            let c;
                            let d = n.data[m]
                            if (m == 'accuracy') {
                                c = accuracyScale(d)
                            } else if (m == 'difficulty') {
                                c = difficultyScale(d)
                            } else {
                                c = confidenceScale(d)
                            }
                            return <rect className='count' key={'d_' + n.data.eventID + Math.random()} style={{ fill: c, opacity: 1, 'rx': metricSquare }} // 'rx': metricSquare 
                                x={xScale(n.data.elapsedTime) + 25 + barPadding + i * (metricSquare + barPadding)}
                                y={yScale(n.y)+barHeight/2 - metricSquare/2}
                                width={n.data.eventID == 'task' ? metricSquare : 0}
                                height={metricSquare}></rect>
                        })}



                    </>
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
        // console.log(participants)
        participants.map(p => p.condition = p.study[0].condition)
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
                        Event View
                </Typography>
                    <Typography className={classes.pos} color="textSecondary"  >
                        Event Sequences
                    </Typography>
                    <Divider />
                    <Box mt={2} >
                        <Grid container className={classes.root} spacing={2}>
                            {Object.keys(conditionGroups).map(cond =>
                                <Grid item xs={12} key={cond}>
                                    <Grid container justify="flex-start" spacing={2}>
                                        <Box display="flex" justifyContent="center" p={2}>
                                            <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                {cond}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        {conditionGroups[cond].slice(0, 50).map(participant => {
                                            return <>
                                                <Grid key={participant.participantID} item>
                                                    <Box borderBottom={1} boxShadow={0} p={1} style={{ borderColor: 'rgba(171, 171, 171, 0.5)' }}>
                                                        {/* <Box display="flex" justifyContent="flex-end"> */}

                                                        <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                            {'Avg. Accuracy: ' + (Math.round(participant.averageAccuracy * 100) / 100)}
                                                        </Typography>
                                                        {/* <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                                {'ID:' + participant.participantID.slice(0, 3) + '...' + participant.participantID.slice(-3)}
                                                            </Typography> */}
                                                        {/* </Box> */}

                                                        {eventMap(participant.study, { width: 1600, height: 30 })}
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
