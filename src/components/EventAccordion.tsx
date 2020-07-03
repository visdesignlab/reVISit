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



    function rectangle(d, attr) {
        return (
            <svg width={150} height={20} >

                <rect className='count' style={{ fill: "#348385" }}
                    x={0}
                    width={scale(d[attr])}
                    height={20}></rect>
                <text x={scale(d[attr]) + 10} y={20}> {d[attr]}</text>
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
                        <HomeIcon />
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
                            <HomeIcon />
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
                            <div className={classes.smallColumn}>
                                <Typography className={classes.secondaryHeading}>{
                                    d.type
                                }</Typography>
                            </div>

                            <div className={classes.column}>
                                <Tooltip title="Event Count">
                                    <Typography className={classes.secondaryHeading}>{rectangle(d, attr)}</Typography>
                                </Tooltip>
                            </div>

                            {/* <div className={classes.column}>
                                <Tooltip title="Event Frequency During Tasks">
                                    <Typography className={classes.secondaryHeading}>{timeHeatMap(d)}</Typography>
                                </Tooltip>
                            </div> */}

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
                            {/* {targets(d, attr, 'label')} */}
                        </div>
                        <div className={classNames(classes.column, classes.helper)}>
                            {/* {heatMap(d)} */}
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
