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

const ItemNameWrapper = ({ itemName, onItemNameChange }) => {
    const [doubleClicked, setDoubleClicked] = React.useState(false);
    const [currentName, setCurrentName] = React.useState(itemName);
    return (
        <div onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => {
            event.stopPropagation();
            setDoubleClicked(true)
        }}>
            {doubleClicked ? (
                <div>
                    <TextField
                        id={itemName}
                        label={itemName}
                        onChange={(ev) => {
                            const newName = ev.target.value;
                            // do checks here to verify name is unique?
                            setCurrentName(newName);
                        }}
                        onKeyPress={(ev) => {
                            // console.log(`Pressed keyCode ${ev.key}`);
                            if (ev.key === "Enter") {
                                onItemNameChange(itemName, currentName);
                                setDoubleClicked(false);
                            }
                        }}
                    />
                </div>
            ) : (
                    // <div>{itemIcon} {currentName}  <EyeTwoTone /> <MoreOutlined /> </div>
                    <div> {currentName} </div>

                )}
        </div>
    );
};


function EventAccordion(props) {

    const { currentTaskData, events, patterns, hideEvent, renameEvent, deleteEvent, addRemoveChild } = useContext(ProvenanceDataContext);

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
        deleteEvent(d.name)
    }


    function hideEventFcn(event, d) {
        event.stopPropagation()
        console.log('hiding', d.name)
        hideEvent(d.name)
        // props.onChange(data);
    }


    const { classes } = props;
    return (
        <div className={classes.root}>
            {events.map((d, i) => {
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

                let all = <>
                    {hide} {del}
                </>
                let baseIcons = <>
                    {hide}
                </>

                function changeGroup(children, reason) {
                    console.log(children, reason);
                    addRemoveChild(children, d.name)
                }

                let groups = d.type == 'group' ? <>
                    <Divider />
                    <ExpansionPanelDetails>
                        <div>
                            <Tags onChange={changeGroup} value={d.children} groups={events.filter(f => f.type == 'native')} />
                        </div>
                    </ExpansionPanelDetails>
                </> : ''

                let icons = d.type == 'native' ? baseIcons : all;

                let icon;

                console.log('patterns', d, patterns[d.name])

                return < ExpansionPanel key={d.id}>
                    <div className={!d.visible ? classes.hide : ''}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>
                                <ItemNameWrapper
                                    itemName={d.name}
                                    onItemNameChange={renameEvent}
                                />
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

                    {patterns && <ExpansionPanelDetails className={classes.details}>

                        <div className={classNames(classes.column, classes.helper)}>
                            {patterns[d.name].nodeLink.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
                            }
                        </div>

                        <div className={classNames(classes.smallColumn, classes.helper)}>
                            {patterns[d.name].nodeLink.map((s, i) => rectangle(s, 'count'))}
                        </div>

                        <div className={classNames(classes.column, classes.helper)}>
                            {patterns[d.name].adjMatrix.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
                            }
                        </div>

                        <div className={classNames(classes.smallColumn, classes.helper)}>
                            {patterns[d.name].adjMatrix.map((s, i) => rectangle(s, 'count'))}
                        </div>


                    </ExpansionPanelDetails>}


                    {groups}
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
