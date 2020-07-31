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


import * as d3 from "d3";

import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceIsolatedNodes from "../components/ProvenanceIsolatedNodes";

import Grid, { GridSpacing } from '@material-ui/core/Grid';



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

function scale(width, maxValue) {
    return d3
        .scaleLinear()
        .range([10, width])
        .domain([0, maxValue]);
}

const accScale = scale(40, 1)
const timeScale = scale(40, 3.59)



function rectangle(d, scale, label) {
    return (
        <svg width={100} height={25} key={d.key} >

            <rect className='count' style={{ fill: "grey", opacity: .5 }}
                x={0}
                width={scale(d)}
                height={25}></rect>
            <text style={{ fontSize: '1.5em' }} x={scale(d)} y={0}> {d + ' ' + label} </text>
        </svg>)
}

function scatter(data, metric, scale, label) {
    let average = data.average[metric];
    return (
        <svg width={100} height={40}>
            {data.values.map(d =>
                <circle className='count' style={{ fill: "rgb(93, 131, 210)", opacity: .1 }}
                    cx={scale(d.answer.accuracy)}
                    cy={10}
                    r={5}>

                </circle>)
            }
            <rect className='count' style={{ fill: "#ff5e00", opacity: 1 }}
                x={scale(average)}
                width={3}
                height={25}></rect>
            <text style={{ fontSize: '1em', "text-anchor": 'start' }} x={scale(average)} y={40}> {Math.round(average * 100) + ' ' + label} </text>

            )

            {/* <text style={{ fontSize: '1.5em', 'text-anchor': 'start' }} x={scale(1.4)} y={20}> {data.average.accuracy + ' ' + label} </text> */}
        </svg>)
}

function histogram(data, average, timeScale, label) {

    let width = 100;
    let height = 40;

    let barHeight = 20;
    let barWidth = 7;
    //compute scale for data; 
    let xDomain = d3.extent(data, d => d.x0);
    let yDomain = d3.extent(data, d => d.length);

    // console.log(xDomain, yDomain)

    let xScale = d3.scaleLinear().domain(xDomain).range([0, width])
    let yScale = d3.scaleLinear().domain(yDomain).range([0, barHeight])



    return (
        <svg width={width} height={height} >
            {data.map((d) =>
                <rect className='count' style={{ fill: "rgb(93, 131, 210)" }}
                    x={xScale(d.x0)}
                    y={barHeight - yScale(d.length)}
                    width={barWidth}
                    height={yScale(d.length)}></rect>
            )}
            <rect className='count' style={{ fill: "#ff5e00", opacity: 1 }}
                x={timeScale(average)}
                width={3}
                height={25}></rect>
            <text style={{ fontSize: '1em', "text-anchor": 'start' }} x={timeScale(average)} y={40}> {Math.round(average * 10) / 10 + ' ' + label} </text>

        </svg>)
}


export default function SimpleCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const { taskStructure } = useContext(ProvenanceDataContext);
    console.log(taskStructure)
    return (<>
        {
            taskStructure.map(task => {
                let taskTooltip =
                    <Typography>
                        {task.prompt}
                    </Typography>
                return (<Box m={2} style={{ display: 'inline-block' }} >
                    <Card className={classes.root} key={task.key} style={{ 'width': 500 }} >
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {task.name}
                            </Typography>
                            <Tooltip title={taskTooltip}>
                                <Typography className={classes.pos} color="textSecondary"  >
                                    {task.prompt.slice(0, 60)}
                                </Typography>
                            </Tooltip>
                            <Divider />

                            {Object.keys(task.stats).map(cond => {
                                let frequentActions = Object.entries(task.actions[cond]).filter(a => a[0] !== 'startedProvenance' && a[0] !== 'Finished Task').sort((a, b) => (a[1] > b[1] ? -1 : 1)).splice(0, 5).map(a => ({ event: a[0], id: a[0] }))
                                return <>
                                    <Typography variant='overline'>
                                        {cond}
                                    </Typography>

                                    <Grid container className={classes.root} spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container justify="flex-start" spacing={2}>
                                                <Grid key={'prov'} item>
                                                    <>
                                                        <Box mt={'5px'} mb={'6px'} >
                                                            <ProvenanceIsolatedNodes key={task.key} nodes={frequentActions}></ProvenanceIsolatedNodes>
                                                        </Box>
                                                        <Typography className={classes.pos} variant='overline' color="primary"  >
                                                            Actions
                                                        </Typography>
                                                    </>
                                                </Grid>
                                                <Box mt={'15px'}>
                                                    <Grid key={'then'} item>
                                                        <TrendingFlatIcon />
                                                    </Grid>

                                                </Box>

                                                <Grid key={'acc'} item>
                                                    {/* <Typography className={classes.pos}  > */}
                                                    {/* {rectangle(task.stats[cond].average.accuracy, accScale, '%')} */}
                                                    {scatter(task.stats[cond], 'accuracy', accScale, '%')}

                                                    {/* </Typography> */}
                                                    <Typography style={{ display: 'block' }} color="primary" variant='overline'  >
                                                        Accuracy
                                                    </Typography>
                                                </Grid>

                                                <Grid key={'time'} item>
                                                    {histogram(task.histogram, task.stats[cond].average.time, timeScale, 'min')}
                                                    {/* {rectangle(task.stats[cond].average.time, timeScale, 'min')} */}
                                                    <Typography style={{ display: 'block' }} color="primary" variant='overline' >
                                                        Time
                                             </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </>

                            }
                            )}
                            <div>

                            </div>


                        </CardContent>
                        <CardActions>
                            <Button size="small">Explore</Button>
                        </CardActions>
                    </Card>
                </Box>)
            }


            )
        }
    </>

    );
}
