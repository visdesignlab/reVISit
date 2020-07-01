import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import * as d3 from "d3";
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalRectSeries,
    HeatmapSeries,
    LabelSeries,
    Hint,
} from 'react-vis';
import { VisibilityOffRounded, VisibilityRounded, HighlightOffRounded, QueuePlayNext, AddCircle } from '@material-ui/icons';

import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const timestamp = new Date('May 23 2017').getTime();
const ONE_DAY = 86400000;

const DATA = [
    { x0: ONE_DAY * 2, x: ONE_DAY * 3, y: 1 },
    { x0: ONE_DAY * 7, x: ONE_DAY * 8, y: 1 },
    { x0: ONE_DAY * 8, x: ONE_DAY * 9, y: 1 },
    { x0: ONE_DAY * 9, x: ONE_DAY * 10, y: 2 },
    { x0: ONE_DAY * 10, x: ONE_DAY * 11, y: 2.2 },
    { x0: ONE_DAY * 19, x: ONE_DAY * 20, y: 1 },
    { x0: ONE_DAY * 20, x: ONE_DAY * 21, y: 2.5 },
    { x0: ONE_DAY * 21, x: ONE_DAY * 24, y: 1 }
].map(el => ({ x0: el.x0 + timestamp, x: el.x + timestamp, y: el.y }));

const styles = theme => ({
    root: {
        width: '70%',
    },
    hide: {
        opacity: .3,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    smallColumn: {
        flexBasis: '15%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});


// const menuButton = ({ width }) => {
//     const [anchorEl, setAnchorEl] = React.useState(null);

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };


//     return (

//         <div><rect className='count' style={{ fill: "#345d85" }} onClick={handleClick}>
//             x = {0}
//             width = {width}
//             height = {20}</rect >
//             <Menu
//                 id="simple-menu"
//                 anchorEl={anchorEl}
//                 keepMounted
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//             >
//                 <MenuItem onClick={handleClose}>Add to Base Events</MenuItem>
//                 <MenuItem onClick={handleClose}>Move to Custom Event</MenuItem>
//             </Menu></div>)
// }

function EventAccordion(props) {
    console.log(props.data)

    let attr = 'count';
    const scale = countScale(props.data, 60, attr)
    console.log(scale.domain(), scale.range())

    function heatMap(d) {


        let eventTypes = [... new Set(props.data.map(d => d.label))];

        let data = [];

        ['before', 'after'].map(t => {
            eventTypes.map(e => {
                data.push({ x: t, y: e, color: Math.random() * 50 })
            })
        })

        return (
            <XYPlot width={150} height={200}
                xType="ordinal"
                xDomain={[... new Set(data.map(d => d.x))]}
                yType="ordinal"
                yDomain={[... new Set(data.map(d => d.y))]}
                margin={50}
            >
                <XAxis orientation="top" />
                <YAxis />
                <HeatmapSeries
                    colorRange={["white", "#345d85"]}

                    className="heatmap-series-example"
                    data={data}
                />
                <LabelSeries
                    style={{ pointerEvents: 'none' }}
                    data={data}
                    labelAnchorX="middle"
                    labelAnchorY="baseline"
                // getLabel={d => `${d.label}`}
                />
            </XYPlot>)
    }


    function timeHeatMap(d) {


        let data = d.heatMap
        let newData = data.map((a, i) => { return { x: i, y: 0, color: a.freq } })
        return (
            <XYPlot width={150} height={20} >
                {/* <XAxis orientation="top" /> */}
                {/* <YAxis /> */}
                <HeatmapSeries
                    colorRange={["white", "#1b423c"]}
                    className="heatmap-series-example"
                    data={newData}
                />
            </XYPlot>)
    }



    function targets(d, attr, label) {

        let ctrans = 'translate(80px, 0px)';
        var css = {
            transform: ctrans
        }

        ctrans = 'translate(-80px, 0px)';
        let css2 = {
            transform: ctrans
        }
        return (
            <div>{d.children.map(c => (
                (<svg width={200} height={20} >
                    <g style={css} onClick={() => newEvent(c, d)}>
                        <text x={-10} y={20} style={{ 'text-anchor': "end" }} > {c[label]}</text>
                        <rect className='count' style={{ fill: "#345d85" }}
                            x={0}
                            width={scale(c[attr])}
                            height={20}></rect>
                        {/* <menuButton width={scale(c[attr])} />)} */}
                        <text x={scale(c[attr]) + 10} y={20}> {Math.round(c[attr] * 100)}</text>
                    </g>
                </svg>)))
            }</div >
        )

    }



    function time() {

        return (
            <XYPlot
                xDomain={[timestamp - 2 * ONE_DAY, timestamp + 30 * ONE_DAY]}
                yDomain={[0.1, 2.1]}
                xType="time"
                width={300}
                height={300}
            >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalRectSeries data={DATA} style={{ stroke: '#fff' }} />
            </XYPlot>
        );

    }

    function rectangle(d, attr) {
        return (
            <svg width={100} height={20} >
                <rect className='count' style={{ fill: "#348385" }}
                    x={0}
                    width={scale(d[attr])}
                    height={20}></rect>
                <text x={scale(d[attr]) + 10} y={20}> {Math.round(d[attr] * 100)}</text>
            </svg>)
    }


    function countScale(data, width, attr) {
        return d3
            .scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data.map(d => d[attr]))]);
    }

    function deleteCustomEvent(event, d) {
        event.stopPropagation()
        let data = [...props.data];
        //remove the event
        data = data.filter(el => el !== d);
        props.onChange(data);
    }


    function hideEvent(event, d) {
        event.stopPropagation()
        let data = [...props.data];
        //toggle hide status of the event
        data.map(el => el == d ? el.hidden = !el.hidden : el.hidden);
        props.onChange(data);
    }

    function moveEvent(event, d) {
        event.stopPropagation()
        let data = [...props.data]
        console.log(data)
        let p = data.filter(d => d.type == "customEvent")[0];
        console.log(p)
        p.children.push(d)
        props.onChange(data);
    }

    function newEvent(d, insertAfter) {
        {
            console.log(d)
            let data = [...props.data]
            let i = data.indexOf(insertAfter);
            data.splice(i + 1, 0, d)
            props.onChange(data);
        }
    }

    const { classes } = props;
    return (
        <div className={classes.root}>
            {props.data.map(d => {
                let hide = <span onClick={(event) => hideEvent(event, d)}>
                    {d.hidden ? (
                        <Tooltip title="Show this Event">
                            <VisibilityOffRounded />
                        </Tooltip>
                    ) : <Tooltip title="Hide this Event">
                            <VisibilityRounded />
                        </Tooltip>} </span>
                let del = <span onClick={(event) => deleteCustomEvent(event, d)}>
                    <Tooltip title="Delete this Event">
                        <HighlightOffRounded />
                    </Tooltip>
                </span>

                let move = <span onClick={(event) => moveEvent(event, d)}>
                    <Tooltip title="Copy Event to Custom Group">
                        <QueuePlayNext />
                    </Tooltip>
                </span>
                let all = <div>
                    {hide} {move} {del}
                </div>
                let baseIcons = <div>
                    {hide} {move}
                </div>

                let icons = d.type == 'nativeEvent' ? baseIcons : all;

                return < ExpansionPanel >
                    <div className={d.hidden ? classes.hide : ''}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>

                                <Typography className={classes.heading}
                                >{d.key}</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{d.type}</Typography>
                            </div>

                            <div className={classes.smallColumn}>
                                <Tooltip title="Event Count">
                                    <Typography className={classes.secondaryHeading}>{rectangle(d, attr)}</Typography>
                                </Tooltip>
                            </div>

                            <div className={classes.column}>
                                <Tooltip title="Event Frequency During Tasks">
                                    <Typography className={classes.secondaryHeading}>{timeHeatMap(d)}</Typography>
                                </Tooltip>
                            </div>

                            <div className={classes.smallColumn}>
                                <Typography className={classes.secondaryHeading}>{icons}</Typography>
                            </div>
                        </ExpansionPanelSummary>
                    </div>
                    <ExpansionPanelDetails className={classes.details}>
                        {/* <div className={classes.column} /> */}
                        <div className={classes.column}>
                            {/* <Typography className={classes.secondaryHeading}>Targets</Typography> */}
                            {targets(d, attr, 'label')}
                        </div>
                        <div className={classNames(classes.column, classes.helper)}>
                            {heatMap(d)}
                        </div>
                        {/* <div className={classNames(classes.column, classes.helper)}>
                            {timeHeatMap(d)}
                        </div> */}
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Button size="small">Delete</Button>
                        <Button size="small" color="primary">
                            Hide
            </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel >

            })}
        </div >
    );
}

EventAccordion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventAccordion);

// export default EventAccordion;
