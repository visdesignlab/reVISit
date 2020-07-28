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

import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';



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
        width: '50%',
        flexGrow: 1,
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

let colors = {
    'nodeLink': 'rgb(198, 224, 214)',
    'adjMatrix': '#d1d1d1'
}

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

    let attr = 'total';
    const scale = countScale(events.map(e => e.count), 60, attr)
    // console.log(scale.domain(), scale.range())



    function rectangle(d, attr) {
        return (
            <svg width={scale(d[attr])} height={20} key={d.key} >
                <Tooltip title={attr}>
                    <>
                        <rect className='count' style={{ fill: colors[attr] || '#d1d1d1' }}
                            x={0}
                            width={scale(d[attr])}
                            height={20}></rect>
                        {/* <text x={scale(d[attr]) + 10} y={10}> {d[attr]}</text> */}
                    </>
                </Tooltip>
            </svg>)
    }

    function label(d, attr) {
        return (
            <svg width={50} height={20} key={d.key} >
                <Tooltip title={attr}>
                    <text x={10} y={15}> {d[attr]}</text>
                </Tooltip>
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

                // console.log('patterns', d, p
                // console.log(d)
                let eventNode = [{ event: d.name, id: d.name }];
                console.log(d)
                return < ExpansionPanel key={d.id}>
                    <div className={!d.visible ? classes.hide : ''}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>

                            <Grid container className={classes.root} spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container justify="flex-start" spacing={2}>
                                        <Grid key={'name'} item xs={4}>
                                            <Box style={{ display: "flex" }}>
                                                <ProvenanceIsolatedNodes key={i} nodes={eventNode}></ProvenanceIsolatedNodes>
                                                <ItemNameWrapper
                                                    itemName={d.name}
                                                    onItemNameChange={renameEvent}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid key={'value'} item xs={2}>
                                            {d.type}
                                        </Grid>
                                        <Grid key={'test'} item xs={4}>
                                            {/* {rectangle(d.count, 'total')} */}
                                            <Box style={{ display: "flex" }}>
                                                {Object.keys(d.count).filter(c => c !== 'total').map(cond => <>
                                                    {rectangle(d.count, cond)}
                                                </>
                                                )}
                                                {label(d.count, 'total')}
                                                {/* <Typography variant='overline'>{d.count.total}</Typography> */}

                                            </Box>
                                            {/* {Object.keys(d.count).map(cond => <>
                                                <Box style={{ display: "flex" }}>
                                                    <Typography variant='overline' style={{ "textAnchor": "end" }}>
                                                        {cond}
                                                    </Typography>

                                                    <Tooltip title="Event Count">
                                                        <Typography className={classes.secondaryHeading}>{rectangle(d.count, cond)}</Typography>
                                                    </Tooltip>
                                                </Box>
                                            </>
                                            )} */}

                                        </Grid>
                                        <Grid key={'icons'} item xs={1}>
                                            <Typography className={classes.secondaryHeading}>{icons}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ExpansionPanelSummary>
                    </div>
                    {/* <ExpansionPanelDetails className={classes.details}>
                    <div style={{ 'margin-top': '-25px' }} className={classNames(classes.column, classes.helper)}>
                        <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
                    </div>
                </ExpansionPanelDetails> */}

                    {patterns[d.name] && <ExpansionPanelDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {Object.keys(patterns[d.name].results).map(cond => {
                                    let data = patterns[d.name].results[cond]

                                    return <>
                                        <Divider />
                                        <Grid container justify="flex-start" spacing={2}>
                                            <Divider />

                                            <Grid key={'prov'} item xs={12}>
                                                <Typography variant='overline'>
                                                    {cond}
                                                </Typography>
                                            </Grid>
                                            <Grid key={'prov'} item>
                                                <>
                                                    <Typography className={classes.pos} variant='overline' color="primary"  >
                                                        {data.length > 0 ? '5 Most Frequent Action Sequences' : 'This action was not used in this task for this condition'}
                                                    </Typography>
                                                    <Box mt={'5px'} mb={'6px'}>
                                                        {data.map((s, i) =>
                                                            <Box style={{ display: 'flex' }}>
                                                                <Grid key={'icons'} item xs={10}>
                                                                    <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>
                                                                </Grid>
                                                                <Grid key={'rect'} item>
                                                                    {rectangle(s, 'count')}
                                                                </Grid>
                                                            </Box>
                                                        )}
                                                    </Box>

                                                </>
                                            </Grid>




                                        </Grid>

                                    </>

                                })}
                            </Grid>
                        </Grid>



                        {/* <Typography className={classes.secondaryHeading}>Node Link</Typography> */}

                        {/* 
                        <div className={classNames(classes.column, classes.helper)}>
                            {data.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
                            }
                        </div>

                        <div className={classNames(classes.smallColumn, classes.helper)}>
                            {data.map((s, i) => rectangle(s, 'count'))}
                        </div> */}

                        {/* <Typography className={classes.secondaryHeading}>Adjacency Matrix</Typography>

                        <div className={classNames(classes.column, classes.helper)}>
                            {patterns[d.name].adjMatrix.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
                            }
                        </div>

                        <div className={classNames(classes.smallColumn, classes.helper)}>
                            {patterns[d.name].adjMatrix.map((s, i) => rectangle(s, 'count'))}
                        </div> */}


                    </ExpansionPanelDetails>
                    }


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


