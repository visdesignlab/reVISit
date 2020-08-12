import React, { useContext } from "react";
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
function eventMap(data, size = { width: 130, height: 30 }) {
    // console.log('data', data, label)
    let width = size.width;
    let height = size.height;

    // let barHeight = 20;
    let barPadding = 2;
    //compute scale for data; 
    // let xDomain = d3.extent(data, d => d.elapsedTime);
    // let yDomain = d3.extent(data, d => d.level);
    // let colors = ["rgb(96, 201, 110)", "rgb(0, 191, 128)", "rgb(0, 180, 147)", "rgb(0, 167, 165)", "rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
    let colors = ["rgb(0, 153, 179)", "rgb(0, 138, 188)", "rgb(0, 122, 189)", "rgb(0, 104, 182)", "rgb(42, 85, 168)", "rgb(77, 65, 147)"]
    // let colors = [ "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2", "#9e0142", "#d53e4f", "#f46d43", "#fdae61","#fee08b", "#ffffbf", ]
    let barHeight = 15

    let xScale = d3.scaleLinear().domain([0, xDomain[1]]).range([0, width - 40])
    let yScale = d3.scaleLinear().domain(yDomain).range([height, 0])
    let accuracyScale = d3.scaleLinear().domain([0, 1]).range(["#f46d43", "#66c2a5"]) // "#3288bd"
    // let colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(categories);
    let colorScale = d3.scaleOrdinal(colors).domain(categories);


    // idealPos: The most preferred position for each label
    // width:    The width of each label


    // d3.interpolatePRGn
    // console.log(xScale.domain(), xScale.range())
    let maxTime = Math.max(...data.map(d => d.elapsedTime + d.duration))
    let studyStart = data.find(d => d.eventID == 'study').elapsedTime
    let axisHeight = yScale.range()[0] + barHeight + 3

    let phases = data.filter(d => d.level == 0)

    var renderer = new labella.Renderer({
        layerGap: 15,
        nodeHeight: 8,
        direction: 'up'
    });


    var nodes = data.filter(d => d.eventID == 'task' && d.category == 'Study').map(d =>
        new labella.Node(xScale(d.elapsedTime + d.duration/2), 70, d)
    )

    let options = {
        minPos: 0, maxPos: Math.max(xScale(maxTime)+80,800), lineSpacing: 2, nodeSpacing: 3, algorithm: 'overlap',
        density: '.75', stubWidth: 5
    }
    var force = new labella.Force(options)
        .nodes(nodes)
        .compute();

    renderer.layout(nodes);


    // console.log('node x positions')
    //     console.log(nodes.map(n=>n.x))


    return (
        <svg width={width} height={200} >
            {/* add axis */}
            {/* {console.log(data.map(d=>d.elapsedTime), Math.max(...data.map(d=>d.elapsedTime)))} */}
            <g style={{"transform":"translate(0px, 100px)"}}>
                <line x1={0} y1={axisHeight} x2={xScale(maxTime) + 5} y2={axisHeight} style={{ "stroke": "rgb(0,0,0,0.25)", "strokeWidth": 1 }}></line>
                {data.map((d, i) => {
                    let rectWidth = (xScale(d.duration) > 5 && d.eventID == 'task') ? xScale(d.duration) - barPadding : xScale(d.duration)
                    return <React.Fragment key={d.participantID + '_' + Math.random()}>
                        <Tooltip title={(d.eventID == 'task' ? d.taskID : d.eventID) + " [" + d.duration + ' / ' + d.accuracy + "]"}>
                            <rect className='count' key={'d_' + d.eventID + '_' + d.elapsedTime} style={{ fill: (d.eventID == 'task' ? 'rgba(171,171,171,0.5)' : d.eventID == 'browse away'  ? 'black'  : colorScale(d.category)), opacity: (d.eventID == 'browse away' ? .4 :.8) , 'rx':(d.eventID == 'browse away' ? 3 : 0) }} // "rgb(93, 131, 210)"
                                x={xScale(d.elapsedTime) + barPadding}
                                y={yScale(d.level)}
                                width={rectWidth}
                                height={barHeight}></rect>
                        </Tooltip>
                       
                        {/* {d.eventID == 'task' && d.category == 'Study' ?
                        <text
                            style={{ fontSize: "1em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                            x={xScale(d.elapsedTime)}
                            y={i % 2 === 0 ? yScale(d.level) - 5 : yScale(d.level) - 15}>
                            {" "}
                            {d.taskID}{" "}
                        </text> : <></>
                    } */}
                     
                    </React.Fragment>
                }
                
                )}
                   {nodes.map(n =><>
                    <line x1={xScale(n.data.elapsedTime + n.data.duration/2)} y1={yScale(n.data.level)} x2={xScale(n.data.elapsedTime + n.data.duration/2)} y2={n.dy-8} style={{ stroke:"rgba(171,171,171,.8)",strokeWidth:'2px', strokeDasharray:'2px'}}></line>
                    <path style={{fill:'none',stroke:"rgba(171,171,171,.8)",strokeWidth:'2px', strokeDasharray:'2px'}}
                className="polymorph"
                d={renderer.generatePath(n)}
                        /><rect className='count' key={'background_' + n.data.eventID} style={{ fill: 'rgba(240,240,240)' }}
                        x={n.x - n.dx / 2 }
                        y={n.y - 10}

                        width={58}
                        height={12}></rect>

                            <text
                                style={{ fontSize: ".75em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                                x={n.x - n.dx / 2}
                                y={n.y}>
                                {" "}
                                {n.data.taskID}{" "}
                            </text>
                            <rect className='count' key={'d_' + n.data.eventID} style={{ fill: accuracyScale(n.data.accuracy), opacity: 1 }}
                            x={n.x - n.dx / 2 -8}
                            y={n.y-10}

                            width={n.data.eventID == 'task' ? 6 : 0}
                            height={12}></rect>
                            </>
                        )}
                {phases.map(p =>
                    <text
                        style={{ fontSize: "1em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                        x={xScale(p.elapsedTime)}
                        y={axisHeight + 15}>
                        {" "}
                        {p.label}{" "}
                    </text>
                )}
                <text
                    style={{ fontSize: "1em", textAnchor: "start", fill: 'rgb(90,90,90)' }}
                    x={xScale(maxTime) + 5}
                    y={axisHeight - 5}>
                    {" "}
                    {Math.round(maxTime) + ' min'}{" "}
                </text>


            </g>
        </svg>)
}



export default function StudyCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const { data } = useContext(ProvenanceDataContext);

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
    if (ready) {
        console.log(data)
    }
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

                                        {conditionGroups[cond].slice(0, 30).map(participant => {
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
