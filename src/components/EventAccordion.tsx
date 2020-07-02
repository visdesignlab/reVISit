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

import { ReactComponent as ActionGroup } from "../icons/action_group.svg";
// import { ReactComponent as Action } from "../icons/action.svg";
// import { ReactComponent as ActionSequence } from "../icons/action_sequence.svg";
// import { ReactComponent as ActionFilter } from "../icons/action_filtered.svg";





import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalRectSeries,
    HeatmapSeries,
    LabelSeries,
} from 'react-vis';
import { VisibilityOffRounded, VisibilityRounded, HighlightOffRounded, QueuePlayNext, AddCircle } from '@material-ui/icons';

import Tags from "../components/GroupSelector"
import { HomeIcon } from "../components/customIcons"
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SvgIcon } from "material-ui";

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
                (<Tooltip title="Click to create Base Event">
                    <svg width={200} height={20} >
                        <g style={css} onClick={() => newEvent(c, d)}>
                            <text x={-10} y={20} style={{ 'text-anchor': "end" }} > {c[label]}</text>
                            <rect className='count' style={{ fill: "#345d85" }}
                                x={0}
                                width={scale(c[attr])}
                                height={20}></rect>
                            {/* <menuButton width={scale(c[attr])} />)} */}
                            <text x={scale(c[attr]) + 10} y={20}> {Math.round(c[attr] * 100)}</text>
                        </g>
                    </svg>
                </Tooltip>)))
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
                        <ActionGroup />
                    </Tooltip>
                </span>
                let all = <>
                    {hide} {move} {del}
                </>
                let baseIcons = <>
                    {hide} {move}
                </>

                let icons = d.type == 'nativeEvent' ? baseIcons : all;

                let icon;

                console.log(d.type)

                switch (d.type) {
                    case 'nativeEvent':

                        icon = <Tooltip title="Copy Event to Custom Group">
                            {/* <Action /> */}
                        </Tooltip>
                    case 'nativeEvent_filtered':
                        icon = <Tooltip title="Copy Event to Custom Group">
                            {/* <ActionFilter /> */}
                        </Tooltip>

                    case 'customEvent':
                        icon = <Tooltip title="Copy Event to Custom Group">
                            <ActionGroup />
                        </Tooltip>
                        break;

                }

                return < ExpansionPanel >
                    <div className={d.hidden ? classes.hide : ''}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>

                                <Typography className={classes.heading}
                                >{d.key}</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{
                                    icon

                                }</Typography>
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
                    {/* <ExpansionPanelDetails className={classes.details}>
                        <div style={{ 'margin-top': '-25px' }} className={classNames(classes.column, classes.helper)}>
                            <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
                        </div>
                    </ExpansionPanelDetails> */}
                    <ExpansionPanelDetails className={classes.details}>
                        {/* <div className={classes.column} /> */}
                        {/* <div className={classNames(classes.helper)}>
                            <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
                        </div> */}

                        <div className={classes.column}>
                            {/* <Typography className={classes.secondaryHeading}>Targets</Typography> */}
                            {targets(d, attr, 'label')}
                        </div>
                        <div className={classNames(classes.column, classes.helper)}>
                            {heatMap(d)}
                        </div>

                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelDetails>
                        <div>
                            <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
                        </div>
                    </ExpansionPanelDetails>
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
