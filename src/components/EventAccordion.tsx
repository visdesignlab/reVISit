import React, { useContext } from "react";
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
import ProvenanceIsolatedNodes from "./ProvenanceIsolatedNodes";
import Box from '@material-ui/core/Box';


import BarChart from "../components/BarChart"
import TimeChart from "../components/timeChart"


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
import { VisibilityOffRounded, VisibilityRounded, HighlightOffRounded, Edit } from '@material-ui/icons';

import Tags from "../components/GroupSelector"
import { HomeIcon } from "../components/customIcons"
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SvgIcon } from "material-ui";
import ProvenanceDataContext from "../components/ProvenanceDataContext";


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
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,

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

    const { currentTaskData, events, hideEvent, renameEvent } = useContext(ProvenanceDataContext);

    console.log('events', events)

    let attr = 'count';
    const scale = countScale(events, 60, attr)
    // console.log(scale.domain(), scale.range())



    function rectangle(d, attr) {
        return (
            <svg width={150} height={20} key={d.key} >

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
        // props.onChange(data);
    }


    function hideEventFcn(event, d) {
        event.stopPropagation()
        console.log('hiding', d.name)
        hideEvent(d.name)
        // props.onChange(data);
    }

    function edit(event, d) {
        event.stopPropagation()
        console.log('renaming', d.name)
        renameEvent(d.name, 'test')
        // props.onChange(data);
    }


    function moveEvent(event, d) {
        event.stopPropagation()
        let data = [...props.data]
        console.log(data)
        let p = data.filter(d => d.type == "customEvent")[0];
        console.log(p)
        p.children.push(d)
        // props.onChange(data);
    }

    function newEvent(d, insertAfter) {
        {
            console.log(d)
            let data = [...props.data]
            let i = data.indexOf(insertAfter);
            data.splice(i + 1, 0, d)
            // props.onChange(data);
        }
    }

    const { classes } = props;
    return (
        <div className={classes.root}>
            {events.map((d, i) => {
                // console.log(d)
                let hide = <span onClick={(event) => hideEventFcn(event, d)}>
                    {!d.visible ? (
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

                // let move = <span onClick={(event) => moveEvent(event, d)}>
                //     <Tooltip title="Copy Event to Custom Group">
                //         <HomeIcon />
                //     </Tooltip>
                // </span>
                let all = <>
                    {hide} {del}
                </>
                let baseIcons = <>
                    {hide}
                </>

                let icons = d.type == 'native' ? baseIcons : all;

                let icon;

                return < ExpansionPanel key={i}>
                    <div className={!d.visible ? classes.hide : ''}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>

                                <Typography className={classes.heading}
                                >
                                    {d.name} <span onClick={(event) => edit(event, d)}>
                                        <Tooltip title="Edit Event Name">
                                            <Edit />
                                        </Tooltip>
                                    </span> </Typography>
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
