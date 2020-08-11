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

let xDomain, yDomain;
function eventMap(data, size = { width: 130, height: 30 }) {
    // console.log('data', data, label)
    let width = size.width;
    let height = size.height;

    // let barHeight = 20;
    let barPadding = 2;
    //compute scale for data; 
    // let xDomain = d3.extent(data, d => d.elapsedTime);
    // let yDomain = d3.extent(data, d => d.level);

    let barHeight = (height / (yDomain[1] + 1)) - 2

    let xScale = d3.scaleLinear().domain([0,xDomain[1]]).range([0, width - 40])
    let yScale = d3.scaleLinear().domain(yDomain).range([height, 0])
    let accuracyScale = d3.scaleLinear().domain([0,1]).range(['#e6550d' ,'#2ca25f'])
    // console.log(xScale.domain(), xScale.range())

    // console.log(data)

    return (
        <svg width={width} height={100} >
            {/* add axis */}
            {/* <line x1={0} y1={yScale.range()[0]} x2={xScale.range()[1]} y2={yScale.range()[0]} style={{ "stroke": "rgb(0,0,0,0.25)", "strokeWidth": 1 }}></line> */}
            {data.map((d, i) => {
                let rectWidth = xScale(d.duration) > 5 ? xScale(d.duration) - barPadding : xScale(d.duration)
                return <>
                <Tooltip title={d.eventID + " [" + d.duration + "]"}>
                    <rect className='count' key={'d_' + d.eventID + '_' + d.elapsedTime} style={{ fill: "rgb(161,161,161)", opacity: .8 }} // "rgb(93, 131, 210)"
                        x={xScale(d.elapsedTime) + barPadding}
                        y={yScale(d.level)}
                        width={rectWidth}
                        height={barHeight}></rect>
                </Tooltip>
                             <rect className='count' key={'d_' + d.eventID } style={{ fill: accuracyScale(d.accuracy), opacity: 1 }}
                             x={xScale(d.elapsedTime) + rectWidth}
                             y={yScale(d.level)-5}
                             width={d.accuracy ? 5 : 0}
                             height={5}></rect>
                             </>
            }
            )}

        </svg>)
}



export default function StudyCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const { data } = useContext(ProvenanceDataContext);

    let participants;
    if (data) {
        participants = data.participants
        let allLevels = participants.map(p=>p.study.map(s=>s.level)).flat();
        xDomain = d3.extent(participants, d => d.minutesToComplete);
        yDomain = d3.extent(allLevels);
    }
    // })
    let colorScale = d3.scaleLinear()
        // .domain(d3.extent(allCounts))
        .domain([0, 800])
        .range([0.3, 1])

    //Only render when all API calls have returned 
    let ready = data;
    if (ready){
        console.log(data)
    }
    // console.log('events', eventGroups)
    return (ready == undefined ? <></> : <>
        <Box m={2} style={{ display: 'inline-block' }} >
            <Card className={classes.root} key={'participantOverview'}  >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Event View
                </Typography>
                    <Tooltip title={'Participant Overview'}>
                        <Typography className={classes.pos} color="textSecondary"  >
                            Event Sequences
                    </Typography>
                    </Tooltip>
                    <Divider />
                    <Box mt={2} >
                        <Grid container className={classes.root} spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justify="flex-start" spacing={2}>
                                    {participants.map(participant =>{
                                        return <Grid key={participant.participantID} item>
                                        <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                            {participant.participantID}
                                            </Typography>
                                        {eventMap(participant.study, { width: 800, height: 50 })}
                                    </Grid>
                                    }
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>

    </>

    );
}
