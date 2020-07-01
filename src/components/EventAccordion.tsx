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
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';


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
        flexBasis: '10%',
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
    console.log(props)

    let attr = 'count';
    const scale = countScale(props.data, 60, attr)
    console.log(scale.domain(), scale.range())

    function heatMap(d) {


        let eventTypes = [... new Set(props.data.map(d => d.label))];

        let data = [];

        ['before', d.label, 'after'].map(t => {
            eventTypes.map(e => {
                data.push({ x: t, y: e, color: t == d.label ? 0 : Math.random() * 50 })
            })
        })

        return (
            <XYPlot width={400} height={200}
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

    function targets(d, attr, label) {
        var ctrans = 'translate(80px, 0px)';
        var css = {
            transform: ctrans
        }
        return (
            <div>{d.children.map(c => (
                (<svg width={210} height={20} >
                    <g style={css}>
                        <text x={-10} y={20} style={{ 'text-anchor': "end" }} > {c[label]}</text>
                        <rect className='count' style={{ fill: "#345d85" }}
                            x={0}
                            width={scale(c[attr])}
                            height={20}></rect>
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
        //remove the event
        data.map(el => el == d ? el.hidden = true : el.hidden = false);
        props.onChange(data);
    }


    const { classes } = props;
    return (
        <div className={classes.root}>
            {props.data.map(d => {

                let hide = <div onClick={(event) => hideEvent(event, d)}><VisibilityRoundedIcon
                /></div>
                let del = <div onClick={(event) => deleteCustomEvent(event, d)}><DeleteForeverRoundedIcon /></div>

                let both = <div>
                    <span onClick={(event) => hideEvent(event, d)}><VisibilityRoundedIcon
                    /></span>
                    <span onClick={(event) => deleteCustomEvent(event, d)}><DeleteForeverRoundedIcon /></span>

                </div>

                let icons = d.type == 'customEvent' ? both :
                    hide;

                return < ExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <div className={classes.column}>

                            <Typography className={classes.heading}
                            >{d.label}</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>{d.type}</Typography>
                        </div>

                        <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>{rectangle(d, attr)}</Typography>
                        </div>

                        <div className={classes.smallColumn}>
                            <Typography className={classes.secondaryHeading}>{icons}</Typography>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        {/* <div className={classes.column} /> */}
                        <div className={classes.column}>
                            {/* <Typography className={classes.secondaryHeading}>Targets</Typography> */}
                            {targets(d, attr, 'label')}
                        </div>
                        <div className={classNames(classes.column, classes.helper)}>
                            {heatMap(d)}
                        </div>
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Button size="small">Delete</Button>
                        <Button size="small" color="primary">
                            Hide
            </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>

            })}
        </div >
    );
}

EventAccordion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventAccordion);

// export default EventAccordion;
